import { NextResponse } from "next/server";
import { confirmEventPayment, registerEvent } from "@/lib/storely";

function dateOrNull(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return value;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (body?.action === "confirm") {
    const registrationId = typeof body.registrationId === "string" ? body.registrationId.trim() : "";
    if (!registrationId) return NextResponse.json({ ok: false, reason: "ההרשמה לא נמצאה" }, { status: 400 });
    const result = await confirmEventPayment(registrationId);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  }

  const stage = body?.stage === "gave_birth" ? "gave_birth" : body?.stage === "pregnant" ? "pregnant" : "";
  if (!stage) return NextResponse.json({ ok: false, reason: "צריך לבחור בהריון או ילדתי" }, { status: 400 });
  const week = Number(body?.pregnancyWeek);
  const result = await registerEvent({
    eventSlug: typeof body?.eventSlug === "string" ? body.eventSlug : "",
    fullName: typeof body?.fullName === "string" ? body.fullName : "",
    phone: typeof body?.phone === "string" ? body.phone : "",
    email: typeof body?.email === "string" ? body.email : "",
    stage,
    dueDate: stage === "pregnant" ? dateOrNull(body?.dueDate) : null,
    pregnancyWeek: stage === "pregnant" && Number.isInteger(week) ? week : null,
    babyBirthDate: stage === "gave_birth" ? dateOrNull(body?.babyBirthDate) : null,
    termsAccepted: body?.termsAccepted === true,
    marketingConsent: body?.marketingConsent === true,
  });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
