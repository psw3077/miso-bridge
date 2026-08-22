(() => {
  const BASE = "https://lqohxtvcpdwmtonsifga.supabase.co/rest/v1/";
  const KEY = "sb_publishable_Wxo0Tl7HSRjKss1RAnhbsg_v5xWN_kR";
  const params = new URLSearchParams(location.search);
  const card = params.get("card") || params.get("name") || "park-sangwook";
  const staff = params.get("staff") || params.get("name") || "박상욱";
  const inboundShare = params.get("sv") || "";
  let variant = "A";

  function send(eventType, target = "") {
    const shareVariant = inboundShare ? `|sv:${inboundShare}` : "";
    fetch(BASE + "miso_card_events", {
      method: "POST",
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        card_id: card,
        staff_name: staff,
        event_type: eventType,
        target: `ab:${variant}${shareVariant}|${target}`,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent.slice(0, 300),
      }),
      keepalive: true,
    }).catch(() => {});
  }

  window.misoCardTrack = send;

  function choose(mode) {
    if (mode === "A" || mode === "B") return mode;
    let selected = localStorage.getItem("miso_card_ab_v1");
    if (!selected) {
      selected = Math.random() < 0.5 ? "A" : "B";
      localStorage.setItem("miso_card_ab_v1", selected);
    }
    return selected;
  }

  function getShareVariant() {
    let selected = localStorage.getItem("miso_card_share_ab_v1");
    if (!selected) {
      selected = Math.random() < 0.5 ? "A" : "B";
      localStorage.setItem("miso_card_share_ab_v1", selected);
    }
    return selected;
  }

  function sharePayload() {
    const selected = getShareVariant();
    const url = new URL(location.href);
    url.searchParams.set("sv", selected);
    url.searchParams.set("share", "official-logo");
    const text = selected === "A"
      ? "주식회사 미소주류 박상욱 대표 전자명함입니다. 주류 납품·신규거래·창업상담이 필요하시면 아래에서 바로 연락주세요."
      : "매장에 맞는 주류 공급과 견적이 필요하신가요? 미소주류 박상욱 대표 전자명함에서 전화·카카오톡·신규거래 상담을 바로 이용하실 수 있습니다.";
    return { sv: selected, url: url.toString(), text };
  }

  function installShareOverride() {
    window.shareCard = async function () {
      const data = sharePayload();
      send("share_message_used", `share_variant_${data.sv}`);
      if (navigator.share) {
        try {
          await navigator.share({ title: "박상욱 대표 | 미소주류", text: data.text, url: data.url });
        } catch (_) {}
        return;
      }
      try {
        await navigator.clipboard.writeText(`${data.text}\n${data.url}`);
        alert("공유 문구와 전자명함 주소를 복사했습니다.");
      } catch (_) {
        prompt("아래 내용을 복사하세요.", `${data.text}\n${data.url}`);
      }
    };

    window.copyCard = async function () {
      const data = sharePayload();
      send("share_message_used", `copy_variant_${data.sv}`);
      try {
        await navigator.clipboard.writeText(`${data.text}\n${data.url}`);
        alert("공유 문구와 전자명함 주소를 복사했습니다.");
      } catch (_) {
        prompt("아래 내용을 복사하세요.", `${data.text}\n${data.url}`);
      }
    };
  }

  function apply() {
    const headline = document.querySelector(".headline");
    const featured = document.querySelector(".sales .featured strong");
    const featuredDescription = document.querySelector(".sales .featured small");

    if (variant === "B") {
      if (headline) headline.innerHTML = "우리 매장에 맞는 주류,<br>빠르게 상담받아보세요.";
      if (featured) featured.textContent = "🏪 우리 매장 주류 견적 받기";
      if (featuredDescription) featuredDescription.textContent = "지역·업종만 알려주시면 공급 가능 여부부터 빠르게 확인합니다.";
    } else {
      if (headline) headline.innerHTML = "술만 납품하지 않습니다.<br>사장님의 장사를 함께 봅니다.";
      if (featured) featured.textContent = "🏪 신규 주류거래 시작하기";
      if (featuredDescription) featuredDescription.textContent = "지역·업종·현재 거래상황을 확인해 빠르게 상담합니다.";
    }

    document.documentElement.dataset.ab = variant;
    send("experiment_view", `hero_cta_${variant}`);
    send("view", location.pathname);
    if (inboundShare) send("shared_open", `share_variant_${inboundShare}`);

    document.addEventListener("click", (event) => {
      const element = event.target.closest("a,button");
      if (!element) return;

      const text = (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 100);
      const href = element.getAttribute("href") || "";
      let eventType = "click";

      if (href.startsWith("tel:")) eventType = "phone";
      else if (href.includes("kakao.com")) eventType = "kakao";
      else if (href.startsWith("sms:")) eventType = "sms";
      else if (href.includes("new-partner")) eventType = "new_partner";
      else if (href.includes("changupin.co.kr") || href.includes("startup")) eventType = "startup";
      else if (text.includes("연락처 저장") || text === "저장") eventType = "save_contact";
      else if (text.includes("명함 보내기")) eventType = "share";
      else if (text.includes("링크 복사")) eventType = "copy_link";
      else if (text.includes("QR")) eventType = "qr";

      send(eventType, text || href);
    });

    setTimeout(installShareOverride, 0);
  }

  fetch(BASE + "miso_card_settings?id=eq.main&select=ab_mode", {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  })
    .then((response) => response.json())
    .then((data) => {
      variant = choose(data?.[0]?.ab_mode || "experiment");
      apply();
    })
    .catch(() => {
      variant = choose("experiment");
      apply();
    });
})();
