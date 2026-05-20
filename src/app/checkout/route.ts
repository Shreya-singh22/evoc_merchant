import { NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_CHECKOUT_API_URL || "http://localhost:3000/api/v1";

export const dynamic = "force-dynamic";

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Checkout | Evoc</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/sdk/style.css">
  <script>
    window.EVOC_CONFIG = {
      apiBaseUrl: '${apiBaseUrl}',
      successUrl: window.location.origin + '/checkout',
      cancelUrl: window.location.origin + '/checkout'
    };
  </script>
</head>
<body>
  <div class="checkout-wrapper">
    <div class="checkout-panel centered">
      <header class="checkout-header">
        <div class="header-action-placeholder"></div>
        <div class="brand-logo-container">
          <img src="/sdk/evoc_logo.png" alt="Merchant" class="brand-logo">
        </div>
        <div class="header-action-placeholder"></div>
      </header>

      <div class="checkout-content"></div>

      <footer class="checkout-footer">
        <div class="footer-links">
          <a href="#">T&C</a>
          <span>|</span>
          <a href="#">Privacy Policy</a>
          <span>|</span>
          <span class="session-id-text" id="footerSessionId">Session: Pending</span>
        </div>
      </footer>
    </div>
  </div>

  <script src="/sdk/app.js"></script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-cache",
    },
  });
}