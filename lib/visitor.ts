export const VISITOR_COOKIE = "storely_visitor";
export const ATTR_COOKIE = "storely_attr";
const VISITOR_KEY = /^[A-Za-z0-9_-]{16,80}$/;

export function validVisitorKey(value: string | undefined | null): value is string {
  return !!value && VISITOR_KEY.test(value);
}

export function createVisitorKey() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function visitorCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };
}

export type LandingAttr = {
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

export function readAttr(value: string | undefined) {
  if (!value) return { referrer: "", utmSource: "", utmMedium: "", utmCampaign: "" };
  try {
    const parsed = JSON.parse(value) as Partial<LandingAttr>;
    return {
      referrer: typeof parsed.referrer === "string" ? parsed.referrer : "",
      utmSource: typeof parsed.utmSource === "string" ? parsed.utmSource : "",
      utmMedium: typeof parsed.utmMedium === "string" ? parsed.utmMedium : "",
      utmCampaign: typeof parsed.utmCampaign === "string" ? parsed.utmCampaign : "",
    };
  } catch {
    return { referrer: "", utmSource: "", utmMedium: "", utmCampaign: "" };
  }
}
