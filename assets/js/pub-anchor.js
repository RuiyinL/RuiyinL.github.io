(function () {
  function applyLang(lang) {
    var isZh = lang === "zh";
    document.body.classList.toggle("site-lang-zh", isZh);
    document.body.classList.toggle("site-lang-en", !isZh);
    document.documentElement.setAttribute("lang", isZh ? "zh-CN" : "en");

    document.querySelectorAll(".site-lang-dropdown__option").forEach(function (opt) {
      var key = opt.getAttribute("data-site-lang");
      opt.setAttribute("aria-checked", key === lang ? "true" : "false");
    });
  }

  function findPubTarget(pubId) {
    if (!pubId) return null;

    var isZh = document.body.classList.contains("site-lang-zh");
    var blocks = isZh
      ? [".i18n-zh-block", ".i18n-en-block"]
      : [".i18n-en-block", ".i18n-zh-block"];
    var langs = isZh ? ["zh", "en"] : ["en", "zh"];

    for (var i = 0; i < blocks.length; i++) {
      var block = document.querySelector(blocks[i]);
      if (!block) continue;

      var el =
        block.querySelector('[data-pub="' + pubId + '"]') ||
        block.querySelector("#" + CSS.escape(pubId));

      if (el) {
        return { el: el, lang: langs[i] };
      }
    }

    return null;
  }

  function getHighlightRow(el) {
    var row = el.closest("li");
    if (row) return row;

    var sibling = el.parentElement && el.parentElement.nextElementSibling;
    if (sibling && sibling.tagName === "OL") {
      return sibling.querySelector("li");
    }

    return el;
  }

  function highlight(el) {
    var row = getHighlightRow(el);
    row.classList.remove("pub-anchor--highlight");
    void row.offsetWidth;
    row.classList.add("pub-anchor--highlight");

    function onEnd() {
      row.classList.remove("pub-anchor--highlight");
      row.removeEventListener("animationend", onEnd);
    }

    row.addEventListener("animationend", onEnd);
  }

  function scrollToPubAnchor(pubId, updateHash) {
    var target = findPubTarget(pubId);
    if (!target) return false;

    applyLang(target.lang);

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        target.el.scrollIntoView({ behavior: "smooth", block: "start" });
        highlight(target.el);

        if (updateHash !== false) {
          history.replaceState(null, "", "#" + encodeURIComponent(pubId));
        }
      });
    });

    return true;
  }

  function handleHash() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    scrollToPubAnchor(decodeURIComponent(hash.slice(1)), false);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.querySelector("[data-pub]")) return;
    window.setTimeout(handleHash, 50);
  });

  window.addEventListener("hashchange", handleHash);

  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[href*='#']");
    if (!link) return;

    var href = link.getAttribute("href") || "";
    var match = href.match(/\/publications\/?#([^#]+)$/);
    if (!match) return;

    var pubId = decodeURIComponent(match[1]);
    if (!findPubTarget(pubId)) return;

    if (window.location.pathname.replace(/\/$/, "").endsWith("/publications")) {
      e.preventDefault();
      scrollToPubAnchor(pubId);
      return;
    }

    // From other pages: allow navigation, hash handler runs after load.
  });
})();
