/**
 * Shabbat window for a site that serves all of Israel.
 * Closes at the earliest candle-lighting and reopens at the latest nightfall,
 * using Hebcal's Israel offsets: 40 minutes in Jerusalem, 30 in Haifa, 20 elsewhere.
 * Nightfall is when the sun is 8.5° below the horizon.
 */
const PLACES: { lat: number; lng: number; candles: number }[] = [
  { lat: 31.76904, lng: 35.21633, candles: 40 }, // Jerusalem
  { lat: 32.96465, lng: 35.496, candles: 20 }, // Safed
  { lat: 32.81303, lng: 34.99928, candles: 30 }, // Haifa
  { lat: 32.08088, lng: 34.78057, candles: 20 }, // Tel Aviv
  { lat: 31.25181, lng: 34.7913, candles: 20 }, // Beersheba
  { lat: 29.55805, lng: 34.94821, candles: 20 }, // Eilat
];

const SUNSET_ZENITH = 90.8333;
const NIGHTFALL_ZENITH = 98.5;
const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

type Ymd = { year: number; month: number; day: number };

export type ShabbatSchedule = {
  closed: boolean;
  changesAt: Date;
  opensAt: Date;
};

export function shabbatSchedule(now: Date): ShabbatSchedule {
  try {
    return schedule(now);
  } catch {
    const retry = new Date(now.getTime() + 60 * 60 * 1000);
    return { closed: false, changesAt: retry, opensAt: retry };
  }
}

function schedule(now: Date): ShabbatSchedule {
  const today = jerusalemDate(now);
  let friday = fridayOf(today);
  let bounds = shabbatWindow(friday);
  if (now.getTime() >= bounds.end.getTime()) {
    friday = addDays(friday, 7);
    bounds = shabbatWindow(friday);
  }
  if (!Number.isFinite(bounds.start.getTime()) || !Number.isFinite(bounds.end.getTime()) || bounds.start >= bounds.end) {
    throw new Error("invalid shabbat window");
  }
  const closed = now.getTime() >= bounds.start.getTime() && now.getTime() < bounds.end.getTime();
  return { closed, changesAt: closed ? bounds.end : bounds.start, opensAt: bounds.end };
}

function shabbatWindow(friday: Ymd): { start: Date; end: Date } {
  const saturday = addDays(friday, 1);
  let start = candleLighting(PLACES[0], friday);
  let end = nightfall(PLACES[0], saturday);
  for (const place of PLACES) {
    const candles = candleLighting(place, friday);
    const havdalah = nightfall(place, saturday);
    if (candles < start) start = candles;
    if (havdalah > end) end = havdalah;
  }
  return { start, end };
}

function candleLighting(place: (typeof PLACES)[number], day: Ymd): Date {
  const sunset = sunEvent(day, place.lat, place.lng, SUNSET_ZENITH);
  const minute = Math.floor(sunset.getTime() / 60000) * 60000;
  return new Date(minute - place.candles * 60000);
}

function nightfall(place: (typeof PLACES)[number], day: Ymd): Date {
  const tzeit = sunEvent(day, place.lat, place.lng, NIGHTFALL_ZENITH);
  return new Date(Math.round(tzeit.getTime() / 60000) * 60000);
}

function fridayOf(day: Ymd): Ymd {
  const wd = weekday(day);
  if (wd === 5) return day;
  if (wd === 6) return addDays(day, -1);
  const until = (5 - wd + 7) % 7;
  return addDays(day, until === 0 ? 7 : until);
}

function addDays({ year, month, day }: Ymd, days: number): Ymd {
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

function weekday({ year, month, day }: Ymd): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function jerusalemDate(now: Date): Ymd {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jerusalem",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
  }).formatToParts(now);
  const bag: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") bag[part.type] = part.value;
  }
  const date = { year: Number(bag.year), month: Number(bag.month), day: Number(bag.day) };
  if (Number(bag.hour) === 24) return addDays(date, 1);
  return date;
}

function sunEvent(day: Ymd, lat: number, lng: number, zenith: number): Date {
  const jd0 = julianDate(day.year, day.month, day.day);
  const once = (jd: number) => {
    const { decl, eqTime } = sunPosition(centuries(jd));
    const cosH =
      Math.cos(zenith * RAD) / (Math.cos(lat * RAD) * Math.cos(decl * RAD)) - Math.tan(lat * RAD) * Math.tan(decl * RAD);
    if (cosH < -1 || cosH > 1) throw new Error("sun below the horizon all day");
    const hourAngle = -Math.acos(cosH);
    return 720 - 4 * (lng + hourAngle * DEG) - eqTime;
  };
  const first = once(jd0);
  const minutes = once(jd0 + first / 1440);
  if (!Number.isFinite(minutes)) throw new Error("sun time");
  return new Date(Date.UTC(day.year, day.month - 1, day.day) + minutes * 60000);
}

function julianDate(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

function centuries(jd: number): number {
  return (jd - 2451545) / 36525;
}

function sunPosition(t: number): { decl: number; eqTime: number } {
  const meanLong = ((280.46646 + t * (36000.76983 + 0.0003032 * t)) % 360 + 360) % 360;
  const anomaly = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  const orbit = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  const anomalyRad = anomaly * RAD;
  const center =
    Math.sin(anomalyRad) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(2 * anomalyRad) * (0.019993 - 0.000101 * t) +
    Math.sin(3 * anomalyRad) * 0.000289;
  const omega = 125.04 - 1934.136 * t;
  const lambda = meanLong + center - 0.00569 - 0.00478 * Math.sin(omega * RAD);
  const seconds = 21.448 - t * (46.815 + t * (0.00059 - t * 0.001813));
  const obliquity = 23 + (26 + seconds / 60) / 60 + 0.00256 * Math.cos(omega * RAD);
  const decl = Math.asin(Math.sin(obliquity * RAD) * Math.sin(lambda * RAD)) * DEG;
  const y = Math.tan((obliquity * RAD) / 2) ** 2;
  const longRad = meanLong * RAD;
  const eqTime =
    4 *
    DEG *
    (y * Math.sin(2 * longRad) -
      2 * orbit * Math.sin(anomalyRad) +
      4 * orbit * y * Math.sin(anomalyRad) * Math.cos(2 * longRad) -
      0.5 * y * y * Math.sin(4 * longRad) -
      1.25 * orbit * orbit * Math.sin(2 * anomalyRad));
  return { decl, eqTime };
}
