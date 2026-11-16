/* Yellow Popcorn — front-end behaviour
   TODO: wire forms to a backend (Formspree, Netlify Forms, or a custom endpoint).
   Until then, submissions stay in the browser and show an honest preview message. */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- Respect reduced motion: hold looping videos on their poster ----- */
  if (reduceMotion) {
    document.querySelectorAll("video[loop]").forEach(function (v) {
      v.removeAttribute("autoplay");
      v.pause();
    });
  }

  /* ----- Preloader ----- */
  var preloader = document.getElementById("preloader");
  var intro = document.getElementById("preloader-video");
  var preloaderHidden = false;

  function hidePreloader() {
    if (preloaderHidden || !preloader) return;
    preloaderHidden = true;
    preloader.classList.add("is-done");
    preloader.setAttribute("aria-hidden", "true");
    setTimeout(function () {
      if (intro) {
        intro.pause();
        intro.removeAttribute("src");
        intro.load();
      }
    }, 800);
  }

  var skip = document.getElementById("preloader-skip");
  if (skip) skip.addEventListener("click", hidePreloader);

  if (reduceMotion) {
    hidePreloader();
  } else if (preloader) {
    var fallback = setTimeout(hidePreloader, 7000);
    if (intro) {
      intro.addEventListener("ended", function () {
        clearTimeout(fallback);
        hidePreloader();
      });
      intro.addEventListener("error", function () {
        clearTimeout(fallback);
        hidePreloader();
      });
      var playPromise = intro.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          clearTimeout(fallback);
          hidePreloader();
        });
      }
    } else {
      window.addEventListener("load", function () {
        clearTimeout(fallback);
        setTimeout(hidePreloader, 400);
      });
    }
  }

  /* ----- Header scroll state ----- */
  var header = document.getElementById("header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ----- Mobile nav ----- */
  var toggle = document.getElementById("menu-toggle");
  var nav = document.getElementById("nav");

  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("is-locked");
  }

  function openMenu() {
    nav.classList.add("is-open");
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("is-locked");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) closeMenu();
      else openMenu();
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ----- Smooth in-page scroll (accounts for fixed header) ----- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = header ? header.offsetHeight - 1 : 64;
      var top = id === "#home" ? 0 : target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });

  /* ----- Highlight the current section in the nav ----- */
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll(".nav-links a")) : [];
  var spySections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  function spy() {
    var line = window.scrollY + window.innerHeight * 0.35;
    var current = null;
    spySections.forEach(function (sec) {
      if (sec.offsetTop <= line) current = sec.id;
    });
    navLinks.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + current;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  if (spySections.length) {
    spy();
    window.addEventListener("scroll", spy, { passive: true });
  }

  /* ----- Scroll reveals ----- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ----- Forms (front-end only) ----- */
  /* TODO: POST this payload to a form backend, then keep the honest success path. */
  var previewMessage =
    "Thanks — this form is a front-end preview and is not sending messages yet. Please email hello@yellowpopcorn.example in the meantime.";

  document.querySelectorAll("form.js-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (status) {
        status.textContent = previewMessage;
        status.classList.add("is-on");
      }
      form.reset();
    });
  });
})();
