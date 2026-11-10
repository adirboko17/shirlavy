export const CONSENT_COOKIE = "sl_cookie_consent";
export const CONSENT_EVENT = "shirlavy:cookie-preferences";
export type CookieChoice = "essential" | "analytics";

export function allowsAnalytics(value: string | undefined | null) {
  return value === "v1:analytics";
}

export function browserCookieChoice(): CookieChoice | null {
  const value = document.cookie.split(";").map(item => item.trim()).find(item => item.startsWith(`${CONSENT_COOKIE}=`))?.slice(CONSENT_COOKIE.length + 1);
  return value === "v1:analytics" ? "analytics" : value === "v1:essential" ? "essential" : null;
}
