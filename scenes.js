/*
 * Scroll scenes for the seva sections, the seva wheel jumps, the closing
 * words reveal, and the UPI copy button in the offering section.
 * Payment itself stays in app.js.
 */
(function () {
  var PA = "230608554002875@cnrb";
  var motionOK = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var header = document.querySelector(".site-header");
  var scenes = Array.prototype.slice.call(document.querySelectorAll("[data-scene]"));
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  function rupees(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  }

  function clamp(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Stable names for screen readers, so the count-up never gets read aloud.
  each(document.querySelectorAll(".tier"), function (t) {
    var amount = t.getAttribute("data-amount");
    t.setAttribute("aria-label",
      t.getAttribute("data-seva") + ", " + t.getAttribute("data-detail") + ", " +
      (amount ? rupees(amount) : "any amount"));
  });

  /* ---------- Count-up on the price medallions ---------- */

  function countUp(el, target, delay) {
    var start = null;
    var duration = 900;
    el.textContent = rupees(0);
    window.setTimeout(function () {
      function step(now) {
        if (start === null) start = now;
        var k = Math.min(1, (now - start) / duration);
        el.textContent = k < 1 ? rupees(Math.round(target * easeOut(k))) : rupees(target);
        if (k < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }, delay);
  }

  function setPriced(scene, on) {
    if (scene._priced === on) return;
    scene._priced = on;
    scene.classList.toggle("priced", on);
    if (!on || !motionOK) return;
    each(scene.querySelectorAll(".tier"), function (t, i) {
      var amount = Number(t.getAttribute("data-amount"));
      if (amount) countUp(t.querySelector(".tier-price"), amount, 120 + i * 90);
    });
  }

  /* ---------- Scroll engine ---------- */

  var ticking = false;

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var hh = header ? header.offsetHeight : 0;
    scenes.forEach(function (scene) {
      var r = scene.getBoundingClientRect();
      if (r.bottom < -40 || r.top > vh + 40) return;
      var stageH = scene._stage.offsetHeight;
      var total = r.height - stageH;
      var p = total > 0 ? clamp((hh - r.top) / total) : 1;
      var enter = clamp(1 - (r.top - hh) / Math.max(1, vh - hh));
      var reveal = easeOut(clamp((enter - 0.12) / 0.88));
      var exit = clamp((p - 0.26) / 0.24);
      scene.style.setProperty("--reveal", reveal.toFixed(4));
      scene.style.setProperty("--exit", exit.toFixed(4));
      var holdFocus = scene.contains(document.activeElement) && document.activeElement.classList.contains("tier");
      if (p > 0.4 || holdFocus) setPriced(scene, true);
      else if (p < 0.34) setPriced(scene, false);
    });
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  // Scroll position inside a scene where its price ring is fully out.
  function pricedY(scene) {
    var hh = header ? header.offsetHeight : 0;
    var top = scene.getBoundingClientRect().top + window.pageYOffset;
    var total = scene.offsetHeight - scene._stage.offsetHeight;
    return Math.max(0, top - hh + total * 0.6);
  }

  if (motionOK && scenes.length) {
    scenes.forEach(function (scene) { scene._stage = scene.querySelector(".stage"); });
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();

    // Wheel nodes and any #seva link land where the prices are showing.
    document.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
      if (!link) return;
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (!target || !target.hasAttribute("data-scene")) return;
      event.preventDefault();
      window.scrollTo({ top: pricedY(target), behavior: "smooth" });
      if (window.history && history.replaceState) history.replaceState(null, "", "#" + target.id);
    });

    // Keyboard users tabbing into a ring always see it.
    document.addEventListener("focusin", function (event) {
      var tier = event.target.closest ? event.target.closest("[data-scene] .tier") : null;
      if (tier) setPriced(tier.closest("[data-scene]"), true);
    });

    window.addEventListener("load", function () {
      var hash = window.location.hash.slice(1);
      var target = hash && document.getElementById(hash);
      if (target && target.hasAttribute("data-scene")) {
        window.scrollTo(0, pricedY(target));
        update();
      }
    });
  }

  /* ---------- Closing words and QR reveal ---------- */

  if (motionOK && "IntersectionObserver" in window) {
    each(document.querySelectorAll(".reveal-words"), function (p) {
      var words = p.textContent.trim().split(/\s+/);
      p.textContent = "";
      words.forEach(function (word, i) {
        var span = document.createElement("span");
        span.className = "w";
        span.style.setProperty("--w", i);
        span.textContent = word;
        p.appendChild(span);
        if (i < words.length - 1) p.appendChild(document.createTextNode(" "));
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    each(document.querySelectorAll(".reveal-words, .qr-halo"), function (el) { io.observe(el); });
  }

  /* ---------- Copy UPI ID from the offering section ---------- */

  var copyCta = document.getElementById("copy-upi-cta");
  if (copyCta) {
    copyCta.addEventListener("click", function () {
      var done = function () {
        copyCta.textContent = "UPI ID copied";
        window.setTimeout(function () { copyCta.textContent = "Copy UPI ID"; }, 1800);
      };
      var fallback = function () {
        var area = document.createElement("textarea");
        area.value = PA;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        try { document.execCommand("copy"); } catch (e) { /* ignore */ }
        area.remove();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(PA).then(done).catch(function () { fallback(); done(); });
      } else {
        fallback();
        done();
      }
    });
  }
})();
