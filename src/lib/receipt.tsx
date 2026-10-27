import { SERVICES, formatNaira } from './booking';
import type { Shipment } from './shipments';

// Receipt design colors (same values as tailwind.config.js)
const ACCENT = '#D9480F';
const ACCENT_TINT = '#FFEDE4';
const INK = '#0E1A2B';
const MUTED = '#5A6676';
const CANVAS = '#F6F7F9';
const SUCCESS = '#14663B';
const LINE = '#C4CBD6';


export const RECEIPT_PAGE = { width: 420, height: 860 };

const escapeHtml = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);

function barcode(id: string) {
  const seed = Array.from(id).map((c) => c.charCodeAt(0));
  let x = 0;
  let bars = '';
  for (let i = 0; i < 52; i++) {
    const w = 1 + ((seed[i % seed.length] * (i + 3)) % 4);
    if (i % 2 === 0) bars += `<rect x="${x}" y="0" width="${w}" height="36" fill="${INK}"/>`;
    x += w;
  }
  return `<svg viewBox="0 0 ${x} 36" preserveAspectRatio="none" width="100%" height="36" xmlns="http://www.w3.org/2000/svg">${bars}</svg>`;
}

// Zigzag paper edges, drawn as small SVG triangles repeated along the edge
const toothTop = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='8'%3E%3Cpath d='M0 8 8 0 16 8z' fill='white'/%3E%3C/svg%3E")`;
const toothBottom = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='8'%3E%3Cpath d='M0 0 8 8 16 0z' fill='white'/%3E%3C/svg%3E")`;

const logo = `<svg width="44" height="44" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="16" fill="${ACCENT}"/><g fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17 24 11l12 6v14l-12 6-12-6z"/><path d="M12 17l12 6 12-6M24 23v14"/></g></svg>`;
const check = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${SUCCESS}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>`;

export function buildReceiptHtml(shipment: Shipment): string {
  const service = SERVICES.find((s) => s.id === shipment.service) ?? SERVICES[1];
  const total = shipment.price + shipment.pickupFee;
  const receiptNo = `R-${shipment.id.replace('TRV-', '')}`;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: ${RECEIPT_PAGE.width}px ${RECEIPT_PAGE.height}px; margin: 0; }
  html { background: ${CANVAS}; }
  html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; width: ${RECEIPT_PAGE.width}px; }
  body { background: ${CANVAS}; color: ${INK}; font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; padding: 8px 10px; }
  .wrap { width: 400px; margin: 0 auto; }
  .edge { height: 8px; background-repeat: repeat-x; background-size: 16px 8px; }
  .edge.top { background-image: ${toothTop}; }
  .edge.bottom { background-image: ${toothBottom}; }
  .receipt { position: relative; background: #fff; padding: 16px 26px 12px; }
  .mono { font-family: 'Courier New', Courier, monospace; }
  .head { display: flex; align-items: center; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 10px; }
  .brand b { font-size: 26px; letter-spacing: -0.5px; }
  .brand small { display: block; font-size: 12px; color: ${MUTED}; margin-top: 1px; }
  .meta { text-align: right; font-size: 12px; color: ${MUTED}; line-height: 1.5; }
  .meta b { display: block; color: ${INK}; letter-spacing: 2px; font-size: 13px; }
  .hero { margin-top: 14px; }
  .hero small { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: ${MUTED}; }
  .hero .amount { font-size: 40px; font-weight: 800; letter-spacing: -1.5px; color: ${ACCENT}; line-height: 1.1; }
  .hero p { font-size: 13px; color: ${MUTED}; margin-top: 2px; }
  .stamp { position: absolute; right: 22px; top: 78px; transform: rotate(-12deg); border: 3px solid ${SUCCESS}; color: ${SUCCESS};
    border-radius: 10px; padding: 3px 12px; font-size: 19px; font-weight: 800; letter-spacing: 4px; }
  .perf { position: relative; border-top: 2px dashed ${LINE}; margin: 12px -26px; }
  .perf::before, .perf::after { content: ''; position: absolute; top: -11px; width: 20px; height: 20px; border-radius: 50%; background: ${CANVAS}; }
  .perf::before { left: -10px; }
  .perf::after { right: -10px; }
  .route { position: relative; padding-left: 28px; }
  .route::before { content: ''; position: absolute; left: 7px; top: 12px; bottom: 26px; border-left: 2px dashed ${LINE}; }
  .stop { position: relative; }
  .stop + .stop { margin-top: 12px; }
  .stop i { position: absolute; left: -28px; top: 3px; width: 16px; height: 16px; border-radius: 50%; border: 3px solid ${ACCENT}; background: #fff; }
  .stop i.fill { background: ${ACCENT}; }
  .stop small { font-size: 12px; color: ${MUTED}; letter-spacing: 1px; text-transform: uppercase; }
  .stop b { display: block; font-size: 15px; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .row { display: flex; align-items: baseline; font-size: 13px; padding: 3px 0; }
  .row .lead { flex: 1; border-bottom: 2px dotted ${LINE}; margin: 0 8px 3px; }
  .row .k { color: ${MUTED}; }
  .row .v { font-weight: 700; }
  .total { display: flex; justify-content: space-between; align-items: baseline; border-top: 2px solid ${INK}; margin-top: 8px; padding-top: 10px; }
  .total span { font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
  .total b { font-size: 22px; letter-spacing: -0.5px; }
  .paid { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; background: #fff; border: 1.5px solid ${LINE}; border-radius: 999px; padding: 5px 12px; font-size: 12px; font-weight: 700; }
  .code { margin-top: 4px; text-align: center; }
  .code div { padding: 0 6px; }
  .code p { margin-top: 5px; font-size: 12px; letter-spacing: 5px; color: ${MUTED}; }
  .promo { margin-top: 10px; background: ${ACCENT_TINT}; border-radius: 16px; padding: 12px 14px; }
  .promo b { display: block; font-size: 14px; color: ${ACCENT}; }
  .promo span { font-size: 12px; color: ${INK}; line-height: 1.45; }
  .thanks { margin-top: 10px; text-align: center; font-size: 12px; color: ${MUTED}; line-height: 1.5; }
  .thanks b { color: ${INK}; font-size: 14px; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="edge top"></div>
    <div class="receipt">
      <div class="head">
        <div class="brand">${logo}<div><b>Trovo</b><small>Ship anything, anywhere</small></div></div>
        <div class="meta"><b>RECEIPT</b>${escapeHtml(receiptNo)}<br/>${escapeHtml(shipment.date)}</div>
      </div>

      <div class="hero">
        <small>Total paid</small>
        <div class="amount">${formatNaira(total)}</div>
        <p>Thank you, your parcel is in good hands.</p>
      </div>
      <div class="stamp">PAID</div>

      <div class="perf"></div>

      <div class="route">
        <div class="stop"><i></i><small>From</small><b>${escapeHtml(shipment.from)}</b></div>
        <div class="stop"><i class="fill"></i><small>To</small><b>${escapeHtml(shipment.to)}</b></div>
      </div>

      <div class="perf"></div>

      <div class="mono">
        <div class="row"><span class="k">Tracking ID</span><span class="lead"></span><span class="v">${escapeHtml(shipment.id)}</span></div>
        <div class="row"><span class="k">Service</span><span class="lead"></span><span class="v">${escapeHtml(service.label)}</span></div>
        <div class="row"><span class="k">${escapeHtml(service.label)} delivery</span><span class="lead"></span><span class="v">${formatNaira(shipment.price)}</span></div>
        <div class="row"><span class="k">Pickup fee</span><span class="lead"></span><span class="v">${formatNaira(shipment.pickupFee)}</span></div>
      </div>
      <div class="total"><span>Total</span><b>${formatNaira(total)}</b></div>
      <div class="paid">${check} Paid with ${escapeHtml(shipment.paidWith)}</div>

      <div class="perf"></div>

      <div class="code">
        <div>${barcode(shipment.id)}</div>
        <p class="mono">${escapeHtml(shipment.id)}</p>
      </div>

      <div class="promo">
        <b>Ship again in under a minute</b>
        <span>Open Trovo, tap New shipment, and a courier is on the way. Insurance up to ₦100,000 is included on every parcel.</span>
      </div>

      <div class="thanks"><b>Thank you for choosing Trovo</b><br/>Keep this receipt for any claim. Questions? support@trovo.example</div>
    </div>
    <div class="edge bottom"></div>
  </div>
</body>
</html>`;
}