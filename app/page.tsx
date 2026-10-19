const WHATSAPP_PHONE = "972502444994";
const WHATSAPP_MESSAGE = "היי הגעתי מהאתר";

const whatsappHref = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export default function HomePage() {
  return (
    <main className="page">
      <div className="glow" aria-hidden="true" />
      <span />
      <div className="content">
        <p className="wordmark">SHIR LAVY</p>
        <div className="rule" />
        <div className="copy">
          <h1>האתר החדש בדרך</h1>
          <p>
            אנחנו עובדות על בית דיגיטלי חדש לקליניקה, לאקדמיה ולחנות. בינתיים, נשמח
            לדבר איתך בוואטסאפ.
          </p>
        </div>
        <div className="cta-wrap">
          <a
            className="cta"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            לתיאום ייעוץ בוואטסאפ
          </a>
        </div>
      </div>
      <footer className="footer">
        <span>קליניקת בוטיק לנשים · אקדמיה לאיפור קבוע</span>
        <span className="brand">© SHIR LAVY</span>
      </footer>
    </main>
  );
}
