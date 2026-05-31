(function () {
  var STORAGE_KEY = "siteLang";

  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStored(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function syncMenuItems(lang) {
    document.querySelectorAll(".site-lang-dropdown__option").forEach(function (opt) {
      var key = opt.getAttribute("data-site-lang");
      opt.setAttribute("aria-checked", key === lang ? "true" : "false");
    });
  }

  function closeAllDropdowns() {
    document.querySelectorAll(".site-lang-dropdown").forEach(function (root) {
      var panel = root.querySelector(".site-lang-dropdown__panel");
      var trigger = root.querySelector(".site-lang-dropdown__trigger");
      root.classList.remove("is-open");
      if (panel) panel.hidden = true;
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  function toggleDropdown(root) {
    var panel = root.querySelector(".site-lang-dropdown__panel");
    var trigger = root.querySelector(".site-lang-dropdown__trigger");
    var open = root.classList.contains("is-open");
    closeAllDropdowns();
    if (!open && panel && trigger) {
      root.classList.add("is-open");
      panel.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }
  }

  function apply(lang) {
    var isZh = lang === "zh";
    document.body.classList.toggle("site-lang-zh", isZh);
    document.body.classList.toggle("site-lang-en", !isZh);
    document.documentElement.setAttribute("lang", isZh ? "zh-CN" : "en");
    syncMenuItems(lang);
    closeAllDropdowns();
  }

  function chooseLang(lang) {
    if (lang !== "en" && lang !== "zh") return;
    setStored(lang);
    apply(lang);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var stored = getStored();
    apply(stored === "zh" ? "zh" : "en");

    document.querySelectorAll(".site-lang-dropdown").forEach(function (root) {
      var trigger = root.querySelector(".site-lang-dropdown__trigger");
      var panel = root.querySelector(".site-lang-dropdown__panel");

      if (trigger) {
        trigger.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var wasOpen = root.classList.contains("is-open");
          closeAllDropdowns();
          if (!wasOpen && panel) {
            root.classList.add("is-open");
            panel.hidden = false;
            trigger.setAttribute("aria-expanded", "true");
          }
        });
      }

      if (panel) {
        panel.addEventListener("click", function (e) {
          var opt = e.target.closest(".site-lang-dropdown__option");
          if (!opt) return;
          e.preventDefault();
          var lang = opt.getAttribute("data-site-lang");
          chooseLang(lang);
        });
      }
    });

    document.addEventListener("click", function () {
      closeAllDropdowns();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllDropdowns();
    });
  });
})();
