(() => {
  const script = document.currentScript;
  const cardId = script?.dataset.cardId;
  const allowedCards = ["hyundai_park_taewan", "plb_park_sangmin", "dream_realestate", "miso_park_sangwook"];
  if (!allowedCards.includes(cardId)) return;
  const endpoint = "https://lqohxtvcpdwmtonsifga.supabase.co/rest/v1/miso_card_events";
  const key = "sb_publishable_Wxo0Tl7HSRjKss1RAnhbsg_v5xWN_kR";
  const events = ["card_view","phone_click","sms_click","kakao_click","consult_click","quote_click","website_click","blog_click","contact_save","share_click","qr_entry","verified_view"];
  const visitorKey = "miso_card_visitor_v2";
  const sessionKey = "miso_card_session_v2";
  const firstSeenKey = "miso_card_first_seen_v2";
  const recent = new Map();

  function id(storage, keyName) {
    let value = storage.getItem(keyName);
    if (!value) { value = crypto.randomUUID(); storage.setItem(keyName, value); }
    return value;
  }
  function source() {
    const url = new URL(location.href);
    const tagged = (url.searchParams.get("utm_source") || url.searchParams.get("source") || "").toLowerCase();
    if (["kakao","profile","blog","qr","sms","direct","website"].includes(tagged)) return tagged;
    const ref = document.referrer.toLowerCase();
    if (!ref) return "direct";
    if (ref.includes("kakao")) return "kakao";
    if (ref.includes("blog.naver") || ref.includes("tistory")) return "blog";
    return "website";
  }
  function device() {
    if (/tablet|ipad/i.test(navigator.userAgent)) return "tablet";
    if (/mobile|iphone|android/i.test(navigator.userAgent)) return "mobile";
    return "desktop";
  }
  async function digest(value) {
    if (!value) return null;
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return [...new Uint8Array(hash)].map(x => x.toString(16).padStart(2,"0")).join("");
  }
  async function track(eventName, target = "") {
    if (!events.includes(eventName)) return;
    const now = Date.now(), previous = recent.get(eventName) || 0;
    if (now - previous < 800) return;
    recent.set(eventName, now);
    const url = new URL(location.href);
    const first = eventName === "card_view" && !localStorage.getItem(firstSeenKey);
    if (first) localStorage.setItem(firstSeenKey, new Date().toISOString());
    const body = {
      card_id: cardId, event_type: eventName, event_name: eventName,
      visitor_id: id(localStorage, visitorKey), session_id: id(sessionStorage, sessionKey),
      entry_source: source(), device_type: device(), is_first_visit: first,
      share_token_hash: await digest(url.searchParams.get("share_token")),
      target: String(target).slice(0,160), metadata: {
        utm_medium: url.searchParams.get("utm_medium")?.slice(0,80) || null,
        utm_campaign: url.searchParams.get("utm_campaign")?.slice(0,80) || null
      }
    };
    fetch(endpoint,{method:"POST",headers:{apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify(body),keepalive:true}).catch(()=>{});
  }
  function inferred(element) {
    const explicit = element.dataset.cardEvent;
    if (events.includes(explicit)) return explicit;
    const href = element.getAttribute("href") || "";
    const text = (element.textContent || "").replace(/\s+/g," ").trim();
    if (href.startsWith("tel:")) return "phone_click";
    if (href.startsWith("sms:")) return "sms_click";
    if (href.includes("kakao")) return "kakao_click";
    if (/寃ъ쟻/.test(text)) return "quote_click";
    if (/?곷떞|臾몄쓽|異붿쿇/.test(text)) return "consult_click";
    if (/釉붾줈洹?.test(text) || href.includes("blog.naver")) return "blog_click";
    if (/?곕씫泥???????.test(text)) return "contact_save";
    if (/紐낇븿 蹂대궡湲?留곹겕 蹂듭궗|怨듭쑀/.test(text)) return "share_click";
    if (/QR/.test(text)) return "qr_entry";
    if (/^https?:/.test(href)) return "website_click";
    return null;
  }
  window.trackCardEvent = track;
  if (!(navigator.doNotTrack === "1")) track("card_view", location.pathname);
  if (source() === "qr") track("qr_entry", "entry");
  document.addEventListener("click", event => {
    const element = event.target.closest?.("a,button,[data-card-event]");
    if (!element) return;
    const name = inferred(element);
    if (name) track(name, element.getAttribute("href") || element.textContent || "");
  });
})();

