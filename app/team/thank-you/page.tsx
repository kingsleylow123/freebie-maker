"use client";

const ANIMATION_CSS = `
@keyframes scaleIn { from { opacity:0; transform:scale(0.7);} to {opacity:1; transform:scale(1);} }
@keyframes fadeUp { from { opacity:0; transform:translateY(20px);} to {opacity:1; transform:translateY(0);} }
`;

export default function TeamThankYou() {
  return (
    <main style={{
      minHeight: "100svh", background: "#0a0a0a", color: "#ededed",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }}>
      <style>{ANIMATION_CSS}</style>
      <div style={{ maxWidth: "440px", width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "20px", animation: "scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          ✅
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: 800, margin: "0 0 12px", animation: "fadeUp 0.5s ease both", animationDelay: "100ms" }}>
          You&apos;re on the team! 🇲🇾
        </h1>
        <p style={{ color: "rgba(237,237,237,0.6)", fontSize: "16px", lineHeight: 1.6, margin: 0, animation: "fadeUp 0.5s ease both", animationDelay: "200ms" }}>
          Your details are saved securely. We&apos;ll reach you on WhatsApp &amp; Telegram, share Drive files to your email, and use your bank info for payouts.
        </p>
        <p style={{ color: "rgba(237,237,237,0.35)", fontSize: "13px", marginTop: "28px", animation: "fadeUp 0.5s ease both", animationDelay: "300ms" }}>
          Need to update something? Just fill the form again.
        </p>
      </div>
    </main>
  );
}
