(() => {
  "use strict";

  const WHATSAPP_URL = "https://wa.me/message/Y3CC2XHDY6N4M1";

  const burgers = [
    { name: "Brasa Original", price: 31.9 },
    { name: "Vulcão Bacon", price: 39.9 },
    { name: "Duplo Sem Freio", price: 42.9 },
    { name: "Fogo Verde", price: 34.9 },
  ];

  const heatLevels = [
    { label: "Brasa", price: 0 },
    { label: "Fogo alto", price: 2 },
    { label: "Cabuloso", price: 4 },
  ];

  const extras = {
    bacon: { label: "Bacon crocante", price: 5 },
    cheddar: { label: "Cheddar extra", price: 4 },
    crispy: { label: "Cebola crispy", price: 3.5 },
    picles: { label: "Picles da casa", price: 2.5 },
  };

  const state = {
    burger: 0,
    heat: 1,
    extras: new Set(["bacon"]),
    quantity: 1,
  };

  const money = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  let toastTimer;

  function showToast(message) {
    const toast = qs(".toast");
    const text = qs(".toast-message");
    if (!toast || !text) return;

    text.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();

      try {
        const copied = document.execCommand("copy");
        field.remove();
        copied ? resolve() : reject(new Error("Não foi possível copiar"));
      } catch (error) {
        field.remove();
        reject(error);
      }
    });
  }

  function openWhatsApp(message) {
    const popup = window.open(WHATSAPP_URL, "_blank");

    if (popup) {
      popup.opener = null;
    } else {
      window.location.href = WHATSAPP_URL;
    }

    if (!message) return;

    copyText(message)
      .then(() => showToast("Mensagem copiada. Cole no WhatsApp para continuar."))
      .catch(() => showToast("WhatsApp aberto para continuar o pedido."));
  }

  function total() {
    const base = burgers[state.burger].price;
    const heat = heatLevels[state.heat].price;
    const extraTotal = [...state.extras].reduce((sum, id) => sum + extras[id].price, 0);
    return (base + heat + extraTotal) * state.quantity;
  }

  function updateBuilder() {
    qsa(".base-option").forEach((button, index) => {
      button.classList.toggle("is-active", index === state.burger);
      button.setAttribute("aria-pressed", String(index === state.burger));
    });

    qsa(".heat-option").forEach((button, index) => {
      button.classList.toggle("is-active", index === state.heat);
      button.setAttribute("aria-pressed", String(index === state.heat));
    });

    qsa(".extra-option").forEach((button) => {
      const active = state.extras.has(button.dataset.id);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      const check = qs(".check-box", button);
      if (check) check.textContent = active ? "✓" : "";
    });

    const quantity = qs(".quantity-value");
    const price = qs(".total-value");
    if (quantity) quantity.textContent = String(state.quantity);
    if (price) price.textContent = money.format(total());
  }

  function buildOrderMessage() {
    const selectedExtras = [...state.extras].map((id) => extras[id].label);

    return [
      "Olá! Quero fazer este pedido na Cabuloso’s:",
      "",
      `${state.quantity}x ${burgers[state.burger].name}`,
      `Intensidade: ${heatLevels[state.heat].label}`,
      `Extras: ${selectedExtras.length ? selectedExtras.join(", ") : "sem extras"}`,
      `Total estimado: ${money.format(total())}`,
    ].join("\n");
  }

  function setupBuilder() {
    qsa(".base-option").forEach((button) => {
      button.addEventListener("click", () => {
        state.burger = Number(button.dataset.index);
        updateBuilder();
      });
    });

    qsa(".heat-option").forEach((button) => {
      button.addEventListener("click", () => {
        state.heat = Number(button.dataset.index);
        updateBuilder();
      });
    });

    qsa(".extra-option").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.id;
        state.extras.has(id) ? state.extras.delete(id) : state.extras.add(id);
        updateBuilder();
      });
    });

    qs(".quantity-minus")?.addEventListener("click", () => {
      state.quantity = Math.max(1, state.quantity - 1);
      updateBuilder();
    });

    qs(".quantity-plus")?.addEventListener("click", () => {
      state.quantity = Math.min(9, state.quantity + 1);
      updateBuilder();
    });

    qs(".checkout-button")?.addEventListener("click", () => openWhatsApp(buildOrderMessage()));

    qsa(".choose-burger").forEach((button) => {
      button.addEventListener("click", () => {
        state.burger = Number(button.dataset.index);
        updateBuilder();
        qs("#monte")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    updateBuilder();
  }

  function setupNavigation() {
    const toggle = qs(".mobile-toggle");
    const menu = qs(".mobile-menu");
    if (!toggle || !menu) return;

    const setMenu = (open) => {
      toggle.classList.toggle("is-open", open);
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      menu.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("menu-open", open);
    };

    toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    qsa("a, button", menu).forEach((item) => item.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) setMenu(false);
    });
  }

  function setupWhatsAppButtons() {
    qsa(".js-whatsapp").forEach((button) => {
      button.addEventListener("click", () => openWhatsApp(button.dataset.message || ""));
    });
  }

  function setupAnimations() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!gsap || !ScrollTrigger || reducedMotion) {
      qsa(".hero-animate, .campaign-animate, .reveal, .menu-card").forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
      const progress = qs(".scroll-progress");
      if (progress) progress.style.transform = "scaleX(1)";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".scroll-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.25 },
    });

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from(".site-header", { y: -50, autoAlpha: 0, duration: 0.8 })
      .from(".hero-animate", { y: 58, autoAlpha: 0, duration: 0.9, stagger: 0.09 }, "-=0.35")
      .from(".hero-media", { xPercent: 8, autoAlpha: 0, duration: 1.15 }, "-=0.9")
      .from(".hero-stamp", { scale: 0.65, rotate: -12, autoAlpha: 0, duration: 0.65 }, "-=0.45");

    gsap.from(".campaign-animate", {
      y: 48,
      autoAlpha: 0,
      duration: 0.85,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: ".campaign", start: "top 74%", once: true },
    });

    gsap.from(".campaign-frame", {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.25,
      ease: "power4.inOut",
      scrollTrigger: { trigger: ".campaign-frame", start: "top 82%", once: true },
    });

    qsa(".reveal").forEach((element) => {
      gsap.from(element, {
        y: 64,
        autoAlpha: 0,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 84%", once: true },
      });
    });

    qsa(".menu-card").forEach((card, index) => {
      gsap.from(card, {
        y: 90,
        rotate: index % 2 ? 1.5 : -1.5,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 84%", once: true },
      });
    });

    qsa("[data-parallax]").forEach((image) => {
      gsap.fromTo(
        image,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: image.closest("section, article") || image, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });

    gsap.to(".manifesto-word", {
      xPercent: -18,
      ease: "none",
      scrollTrigger: { trigger: ".manifesto", start: "top bottom", end: "bottom top", scrub: 1 },
    });

    gsap.to(".final-word", {
      xPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: ".final-cta", start: "top bottom", end: "bottom top", scrub: 1 },
    });

    qsa(".brand-logo-float").forEach((logo, index) => {
      gsap.to(logo, {
        y: index % 2 ? 18 : -18,
        rotate: index % 2 ? 2 : -2,
        ease: "none",
        scrollTrigger: { trigger: logo, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
    });

    gsap.from(".side-item", {
      x: 54,
      autoAlpha: 0,
      stagger: 0.09,
      duration: 0.75,
      ease: "power3.out",
      scrollTrigger: { trigger: ".side-list", start: "top 82%", once: true },
    });

    gsap.from(".builder-step", {
      x: 60,
      autoAlpha: 0,
      stagger: 0.13,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: { trigger: ".builder-panel", start: "top 76%", once: true },
    });

    gsap.from(".process-list li", {
      x: 70,
      autoAlpha: 0,
      stagger: 0.14,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: ".process-list", start: "top 78%", once: true },
    });

    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  }

  setupNavigation();
  setupBuilder();
  setupWhatsAppButtons();
  setupAnimations();
})();
