import { NextResponse, type NextRequest } from "next/server";
import { recordEvent, requestHostname, storefrontHostname } from "@/lib/storely";
import { ATTR_COOKIE, createVisitorKey, readAttr, validVisitorKey, VISITOR_COOKIE, visitorCookieOptions } from "@/lib/visitor";

function place(value: string | null) {
  const raw = value?.trim() ?? "";
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function referrerHost(value: string | null) {
  if (!value) return "";
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return "";
  }
}

function isPrefetch(request: NextRequest) {
  if (request.headers.get("next-router-prefetch") === "1") return true;
  if (request.headers.get("x-middleware-prefetch") === "1") return true;
  const purpose = `${request.headers.get("purpose") ?? ""} ${request.headers.get("sec-purpose") ?? ""}`;
  return purpose.includes("prefetch");
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const secure = request.nextUrl.protocol === "https:";
  const current = request.cookies.get(VISITOR_COOKIE)?.value;
  const visitorKey = validVisitorKey(current) ? current : createVisitorKey();
  if (!validVisitorKey(current)) {
    response.cookies.set(VISITOR_COOKIE, visitorKey, visitorCookieOptions(secure));
  }

  const host = requestHostname(request.headers.get("host"));
  const landing = readAttr(request.cookies.get(ATTR_COOKIE)?.value);
  const querySource = request.nextUrl.searchParams.get("utm_source")?.slice(0, 120) ?? "";
  const queryMedium = request.nextUrl.searchParams.get("utm_medium")?.slice(0, 120) ?? "";
  const queryCampaign = request.nextUrl.searchParams.get("utm_campaign")?.slice(0, 120) ?? "";
  const external = referrerHost(request.headers.get("referer"));
  const sameSite = !external || external === host || external.endsWith(`.${host}`);
  const nextAttr = {
    referrer: landing.referrer || (sameSite ? "" : external),
    utmSource: querySource || landing.utmSource,
    utmMedium: queryMedium || landing.utmMedium,
    utmCampaign: queryCampaign || landing.utmCampaign,
  };
  if (JSON.stringify(nextAttr) !== JSON.stringify(landing)) {
    response.cookies.set(ATTR_COOKIE, JSON.stringify(nextAttr), { ...visitorCookieOptions(secure), httpOnly: false });
  }

  if (request.method === "GET" && !isPrefetch(request) && request.headers.get("rsc") === "1" && storefrontHostname(host)) {
    const path = request.nextUrl.pathname || "/";
    const country = place(request.headers.get("x-vercel-ip-country"));
    const city = place(request.headers.get("x-vercel-ip-city"));
    try {
      await recordEvent({
        hostHeader: host,
        visitorKey,
        event: "page_view",
        path,
        country,
        city,
        referrer: nextAttr.referrer,
        utmSource: nextAttr.utmSource,
        utmMedium: nextAttr.utmMedium,
        utmCampaign: nextAttr.utmCampaign,
      });
      if (path === "/checkout") {
        await recordEvent({
          hostHeader: host,
          visitorKey,
          event: "begin_checkout",
          path,
          country,
          city,
        });
      }
    } catch {
      /* a tracking miss should not block the page */
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/|api/|.*\\..*).*)"],
};
