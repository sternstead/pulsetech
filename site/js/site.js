/* ============================================================
   PULSETECH — SITE BEHAVIOUR
   No dependencies. Everything here is progressive enhancement:
   with JavaScript disabled the pages still render, still read,
   and every link and phone number still works.
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     DESKTOP DROPDOWNS
     Button-based, aria-expanded, closes on ESC, outside click
     and focus leaving the group.
     ---------------------------------------------------------- */
  function initDropdowns() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-drop-trigger]"));
    if (!triggers.length) return;

    function closeAll(except) {
      triggers.forEach(function (t) {
        if (t === except) return;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        t.setAttribute("aria-expanded", "false");
        if (panel) panel.removeAttribute("data-open");
      });
    }

    triggers.forEach(function (trigger) {
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if (!panel) return;

      trigger.addEventListener("click", function () {
        var open = trigger.getAttribute("aria-expanded") === "true";
        closeAll(trigger);
        trigger.setAttribute("aria-expanded", open ? "false" : "true");
        if (open) panel.removeAttribute("data-open");
        else panel.setAttribute("data-open", "");
      });

      // Pointer users expect hover; keyboard users get click.
      var group = trigger.parentNode;
      var timer;
      group.addEventListener("mouseenter", function () {
        if (!window.matchMedia("(min-width: 1080px)").matches) return;
        clearTimeout(timer);
        closeAll(trigger);
        trigger.setAttribute("aria-expanded", "true");
        panel.setAttribute("data-open", "");
      });
      group.addEventListener("mouseleave", function () {
        if (!window.matchMedia("(min-width: 1080px)").matches) return;
        timer = setTimeout(function () {
          trigger.setAttribute("aria-expanded", "false");
          panel.removeAttribute("data-open");
        }, 160);
      });

      // Close when focus leaves the trigger + panel entirely.
      group.addEventListener("focusout", function (e) {
        if (group.contains(e.relatedTarget)) return;
        trigger.setAttribute("aria-expanded", "false");
        panel.removeAttribute("data-open");
      });
    });

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-drop-trigger], [data-drop]")) return;
      closeAll(null);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var open = document.querySelector('[data-drop-trigger][aria-expanded="true"]');
      closeAll(null);
      if (open) open.focus();
    });
  }

  /* ----------------------------------------------------------
     MOBILE DRAWER
     Scroll lock, focus trap, ESC, restores focus on close.
     ---------------------------------------------------------- */
  function initDrawer() {
    var drawer = document.querySelector("[data-drawer]");
    var openBtn = document.querySelector("[data-drawer-open]");
    var closeBtn = document.querySelector("[data-drawer-close]");
    if (!drawer || !openBtn) return;

    var lastFocus = null;
    var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function open() {
      lastFocus = document.activeElement;
      drawer.hidden = false;
      // next frame so the transition runs
      requestAnimationFrame(function () { drawer.setAttribute("data-open", ""); });
      openBtn.setAttribute("aria-expanded", "true");
      document.body.classList.add("is-locked");
      var first = drawer.querySelector(FOCUSABLE);
      if (first) first.focus();
    }

    function close() {
      drawer.removeAttribute("data-open");
      openBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("is-locked");
      window.setTimeout(function () { drawer.hidden = true; }, reduceMotion ? 0 : 300);
      if (lastFocus) lastFocus.focus();
    }

    openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);

    // Close after navigating to an in-page or new route.
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a[href]")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (drawer.hidden) return;
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;

      var items = Array.prototype.filter.call(
        drawer.querySelectorAll(FOCUSABLE),
        function (el) { return el.offsetParent !== null; }
      );
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Drop back to desktop nav if the viewport grows while open.
    window.addEventListener("resize", function () {
      if (!drawer.hidden && window.matchMedia("(min-width: 1080px)").matches) close();
    });
  }

  /* ----------------------------------------------------------
     DRAWER ACCORDIONS
     ---------------------------------------------------------- */
  function initFolds() {
    document.querySelectorAll("[data-fold]").forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        if (open) panel.removeAttribute("data-open");
        else panel.setAttribute("data-open", "");
      });
    });
  }

  /* ----------------------------------------------------------
     REVEAL
     One quiet entrance per section, once. Content is visible by
     default in CSS; only the .js class opts into hiding it, so a
     JS failure can never leave the page blank.
     ---------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------
     FLOATING WHATSAPP
     Enters once, after the hero, so it doesn't land on top of
     the primary CTA the moment the page opens.
     ---------------------------------------------------------- */
  function initFloat() {
    var float = document.querySelector("[data-wa-float]");
    if (!float) return;
    float.style.opacity = "0";
    float.style.transform = "translateY(12px)";
    function show() {
      float.style.transition = reduceMotion ? "none" : "opacity .35s ease, transform .35s ease";
      float.style.opacity = "1";
      float.style.transform = "none";
      window.removeEventListener("scroll", onScroll);
    }
    function onScroll() { if (window.scrollY > 420) show(); }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.setTimeout(function () { if (window.scrollY <= 420) show(); }, 2600);
  }

  /* ----------------------------------------------------------
     ENQUIRY FORM
     Validates fully client-side. With no endpoint configured it
     says so plainly and hands the visitor a working alternative,
     rather than pretending the message was sent.
     ---------------------------------------------------------- */
  var FORM_ENDPOINT = ""; // set to a Formspree / Getform / function URL at launch

  function initForm() {
    var form = document.querySelector("[data-booking-form]");
    if (!form) return;
    var status = form.querySelector("[data-form-status]");

    function setError(field, message) {
      var el = form.querySelector('[data-error-for="' + field.name + '"]');
      if (el) el.textContent = message || "";
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validate() {
      var ok = true, firstBad = null;
      form.querySelectorAll("[required]").forEach(function (field) {
        var value = (field.value || "").trim();
        if (!value) {
          setError(field, "We need this to get back to you.");
          ok = false; firstBad = firstBad || field;
        } else { setError(field, ""); }
      });

      var phone = form.querySelector('[name="phone"]');
      if (phone && phone.value.trim() && !/^[\d+\s()-]{7,}$/.test(phone.value.trim())) {
        setError(phone, "That doesn't look like a phone number we can call.");
        ok = false; firstBad = firstBad || phone;
      }

      if (firstBad) firstBad.focus();
      return ok;
    }

    // Clear an error as soon as the visitor fixes it.
    form.addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid") === "true" && (e.target.value || "").trim()) {
        setError(e.target, "");
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        status.className = "form-status form-status--error";
        status.textContent = "Some details are missing. The highlighted fields need filling in.";
        return;
      }

      if (!FORM_ENDPOINT) {
        status.className = "form-status form-status--info";
        status.textContent =
          "This form isn't connected to an inbox yet, so nothing was sent. Call 0711 702 233 or use the WhatsApp button and you'll reach us straight away.";
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      status.className = "form-status form-status--info";
      status.textContent = "Sending your enquiry…";

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
          status.className = "form-status form-status--info";
          status.textContent = "Enquiry sent. We'll come back to you during working hours.";
        })
        .catch(function () {
          status.className = "form-status form-status--error";
          status.textContent =
            "That didn't send. Call 0711 702 233 or message us on WhatsApp and we'll pick it up from there.";
        })
        .then(function () { btn.disabled = false; });
    });
  }


  /* ----------------------------------------------------------
     VIDEO
     Poster renders immediately; the file is only fetched when the
     visitor presses play. Nothing downloads on page load, and a
     slow connection simply keeps the still image.
     ---------------------------------------------------------- */
  function initVideo() {
    document.querySelectorAll("[data-lazy-video]").forEach(function (video) {
      var stage = video.closest(".videoblock__stage");
      var button = stage && stage.querySelector("[data-video-play]");
      if (!button) return;

      button.addEventListener("click", function () {
        if (!video.src) video.src = video.getAttribute("data-src");
        var played = video.play();
        if (played && played.catch) {
          played.catch(function () {
            // autoplay policy refused it; leave the poster and the button
            button.hidden = false;
          });
        }
        button.hidden = true;
        video.setAttribute("controls", "");
      });
    });
  }

  /* ----------------------------------------------------------
     LIGHTBOX
     Native <dialog>, so focus containment, ESC and backdrop come
     from the browser rather than from hand-written traps.
     ---------------------------------------------------------- */
  function initLightbox() {
    var dialog = document.querySelector("[data-lightbox-dialog]");
    var dataEl = document.querySelector("[data-gallery-data]");
    if (!dialog || !dataEl || typeof dialog.showModal !== "function") return;

    var items;
    try { items = JSON.parse(dataEl.textContent); } catch (e) { return; }
    if (!items.length) return;

    var img = dialog.querySelector("[data-lightbox-img]");
    var caption = dialog.querySelector("[data-lightbox-caption]");
    var count = dialog.querySelector("[data-lightbox-count]");
    var post = dialog.querySelector("[data-lightbox-post]");
    var index = 0;
    var opener = null;

    // The gallery sits in a document that may be at any depth, so the
    // stored paths are resolved against whatever the page already uses.
    var prefix = (function () {
      var probe = document.querySelector(".gallery__open img");
      if (!probe) return "";
      var src = probe.getAttribute("src") || "";
      var m = src.match(/^((?:\.\.\/)+)/);
      return m ? m[1] : "";
    })();

    function render() {
      var item = items[index];
      img.src = prefix + item.src.replace(/^\//, "");
      img.alt = item.alt;
      caption.textContent = item.caption;
      count.textContent = index + 1 + " / " + items.length;
      post.href = item.post;
    }

    function open(i, trigger) {
      index = i; opener = trigger;
      render();
      dialog.showModal();
    }

    function step(delta) {
      index = (index + delta + items.length) % items.length;
      render();
    }

    document.querySelectorAll("[data-lightbox]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        open(parseInt(btn.getAttribute("data-lightbox"), 10) || 0, btn);
      });
    });

    dialog.querySelector("[data-lightbox-next]").addEventListener("click", function () { step(1); });
    dialog.querySelector("[data-lightbox-prev]").addEventListener("click", function () { step(-1); });
    dialog.querySelector("[data-lightbox-close]").addEventListener("click", function () { dialog.close(); });

    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    });

    // Clicking the backdrop closes it, clicking the panel does not.
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", function () {
      if (opener) opener.focus();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initDropdowns();
    initDrawer();
    initFolds();
    initReveal();
    initFloat();
    initForm();
    initVideo();
    initLightbox();
  });
})();
