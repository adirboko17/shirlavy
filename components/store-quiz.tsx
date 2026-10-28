"use client";

import { useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { ProductCard } from "./product-card";
import { useSite } from "@/lib/site";

type Choice = { id: string; label: string; next: string; products: string[] };
type Question = { id: string; title: string; choices: Choice[] };
type Quiz = {
  introTitle: string;
  introText: string;
  startLabel: string;
  image: string;
  formTitle: string;
  formText: string;
  submitLabel: string;
  doneTitle: string;
  doneText: string;
  entry: string;
  questions: Question[];
};

function text(value: unknown, max = 400) {
  return typeof value === "string" ? value.replace(/\u0000/g, "").slice(0, max) : "";
}

function parseQuiz(value: unknown): Quiz | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const questions = Array.isArray(row.questions) ? row.questions.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const question = item as Record<string, unknown>;
    const id = text(question.id, 40);
    if (!id) return [];
    const choices = Array.isArray(question.choices) ? question.choices.flatMap((choice) => {
      if (!choice || typeof choice !== "object") return [];
      const rowChoice = choice as Record<string, unknown>;
      const choiceId = text(rowChoice.id, 40);
      if (!choiceId) return [];
      return [{
        id: choiceId,
        label: text(rowChoice.label, 160),
        next: text(rowChoice.next, 40),
        products: Array.isArray(rowChoice.products) ? rowChoice.products.filter((product): product is string => typeof product === "string") : [],
      }];
    }) : [];
    return [{ id, title: text(question.title, 200), choices }];
  }) : [];
  if (!questions.length) return null;
  const image = text(row.image, 2000);
  return {
    introTitle: text(row.introTitle, 160),
    introText: text(row.introText, 600),
    startLabel: text(row.startLabel, 40) || "מתחילים",
    image: image.startsWith("https://") ? image : "",
    formTitle: text(row.formTitle, 160),
    formText: text(row.formText, 400),
    submitLabel: text(row.submitLabel, 40) || "המשך",
    doneTitle: text(row.doneTitle, 160),
    doneText: text(row.doneText, 600),
    entry: text(row.entry, 40) || questions[0].id,
    questions,
  };
}

export function StoreQuiz() {
  const site = useSite();
  const path = usePathname();
  const quiz = parseQuiz(site.shop.quiz);
  const [step, setStep] = useState<"intro" | "question" | "form" | "done">("intro");
  const [questionId, setQuestionId] = useState("");
  const [products, setProducts] = useState<string[]>([]);
  if (!quiz || path !== "/" || site.menuOpen || site.cartOpen) return null;
  const question = quiz.questions.find((item) => item.id === (questionId || quiz.entry)) ?? quiz.questions[0];
  const recommended = site.products.filter((product) => products.includes(product.id));

  return (
    <section style={{ padding: "0 clamp(16px,4vw,48px) clamp(56px,8vw,80px)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", background: "#F7F5F2", borderRadius: 28, padding: "clamp(24px,4vw,40px)", display: "flex", flexDirection: "column", gap: 16 }}>
        {quiz.image && step === "intro" ? <img src={quiz.image} alt="" style={{ width: "100%", borderRadius: 20, maxHeight: 280, objectFit: "cover" }} /> : null}
        {step === "intro" ? (
          <>
            <h2 style={{ margin: 0, fontWeight: 400, fontSize: 32 }}>{quiz.introTitle}</h2>
            <p style={{ margin: 0, lineHeight: 1.7, color: "#5A5A5A" }}>{quiz.introText}</p>
            <button type="button" className="pill gold" style={{ height: 48, alignSelf: "flex-start" }} onClick={() => { setQuestionId(quiz.entry); setStep("question"); }}>{quiz.startLabel}</button>
          </>
        ) : null}
        {step === "question" ? (
          <>
            <h2 style={{ margin: 0, fontWeight: 400, fontSize: 28 }}>{question.title}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {question.choices.map((choice) => (
                <button key={choice.id} type="button" className="chip" style={{ background: "#fff" }} onClick={() => {
                  if (choice.next === "form") {
                    setProducts(choice.products);
                    setStep("form");
                    return;
                  }
                  setQuestionId(choice.next);
                }}>{choice.label}</button>
              ))}
            </div>
          </>
        ) : null}
        {step === "form" ? (
          <form onSubmit={(event) => { event.preventDefault(); setStep("done"); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ margin: 0, fontWeight: 400 }}>{quiz.formTitle}</h2>
            <p style={{ margin: 0, color: "#5A5A5A" }}>{quiz.formText}</p>
            <input required placeholder="שם" aria-label="שם" style={field} />
            <input required type="email" placeholder="אימייל" aria-label="אימייל" style={field} />
            <input required placeholder="טלפון" aria-label="טלפון" style={field} />
            <button type="submit" className="pill gold" style={{ height: 48, alignSelf: "flex-start" }}>{quiz.submitLabel}</button>
          </form>
        ) : null}
        {step === "done" ? (
          <>
            <h2 style={{ margin: 0, fontWeight: 400 }}>{quiz.doneTitle}</h2>
            <p style={{ margin: 0, color: "#5A5A5A" }}>{quiz.doneText}</p>
            {recommended.length ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
                {recommended.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}

const field: CSSProperties = { height: 46, border: 0, borderRadius: 999, background: "#fff", padding: "0 16px", font: "inherit" };
