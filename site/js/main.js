/* ============================================================
   Static guide interactions
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var cfg = window.SITE_CONFIG || {};
  var dictionaries = window.SITE_I18N || {};
  var PLACEHOLDER = "https://api.example.com";
  var LANG_STORAGE_KEY = "botapi-help-lang";
  var origin = /^https?:/i.test(location.origin) ? location.origin : "";
  var platform = resolvePlatform(cfg, cfg.platformMap || {}, origin);
  var baseUrl = resolveBaseUrl(cfg.originMap || {}, origin);
  var currentLanguage = resolveLanguage(cfg, platform, origin);

  applyPlatform(platform);
  applyLanguage(currentLanguage);

  function resolveBaseUrl(map, currentOrigin) {
    var base;
    if (currentOrigin && map[currentOrigin]) {
      base = map[currentOrigin];
    } else if (currentOrigin) {
      base = currentOrigin.replace(/^(https?:\/\/)[^.]+\./, "$1api.");
    } else {
      base = PLACEHOLDER;
    }
    return base.replace(/\/+$/, "");
  }

  function resolvePlatform(siteConfig, platformMap, currentOrigin) {
    if (currentOrigin && platformMap[currentOrigin]) return platformMap[currentOrigin];

    var host = location.hostname || "";
    if (host.indexOf("chinarouter") !== -1) return "overseas";
    if (host.indexOf("botsmart") !== -1) return "kjapi";

    return siteConfig.defaultPlatform || "";
  }

  function resolveLanguage(siteConfig, currentPlatform, currentOrigin) {
    var saved = readStoredLanguage();
    if (saved && dictionaries[saved]) return saved;

    var languageMap = siteConfig.languageMap || {};
    if (currentOrigin && dictionaries[languageMap[currentOrigin]]) {
      return languageMap[currentOrigin];
    }

    var host = location.hostname || "";
    var defaultLanguageMap = siteConfig.defaultLanguageMap || {};
    var platformMap = siteConfig.platformMap || {};
    if (host.indexOf("botsmart") !== -1) return defaultLanguageMap.kjapi || "zh-CN";
    if (host.indexOf("chinarouter") !== -1) return defaultLanguageMap.overseas || "en";
    if (currentOrigin && currentPlatform && platformMap[currentOrigin] === currentPlatform && dictionaries[defaultLanguageMap[currentPlatform]]) {
      return defaultLanguageMap[currentPlatform];
    }

    return dictionaries.en ? "en" : "zh-CN";
  }

  function readStoredLanguage() {
    try {
      return localStorage.getItem(LANG_STORAGE_KEY);
    } catch (e) {
      return "";
    }
  }

  function storeLanguage(lang) {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {}
  }

  function applyPlatform(currentPlatform) {
    if (!currentPlatform) return;

    root.setAttribute("data-platform", currentPlatform);
    document.querySelectorAll("[data-platform-hide]").forEach(function (el) {
      var platforms = el.getAttribute("data-platform-hide").split(/\s+/);
      if (platforms.indexOf(currentPlatform) !== -1) el.hidden = true;
    });
  }

  function translate(key) {
    var dict = dictionaries[currentLanguage] || {};
    var fallback = dictionaries["zh-CN"] || {};
    return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : fallback[key] || "";
  }

  function applyLanguage(lang) {
    if (!dictionaries[lang]) return;

    currentLanguage = lang;
    root.setAttribute("lang", lang);
    root.setAttribute("data-lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = translate(el.getAttribute("data-i18n"));
    });

    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      document.title = translate(el.getAttribute("data-i18n-title"));
    });

    document.querySelectorAll("*").forEach(function (el) {
      Array.prototype.slice.call(el.attributes).forEach(function (attr) {
        if (attr.name.indexOf("data-i18n-attr-") !== 0) return;
        var targetAttr = attr.name.slice("data-i18n-attr-".length);
        el.setAttribute(targetAttr, translate(attr.value));
      });
    });

    replaceBaseUrl();
    applyConfigOverrides();
    updateCopyButtons(false);
    updateLanguageControls();
  }

  function applyConfigOverrides() {
    if (cfg.title) document.title = cfg.title;
    if (cfg.brandName) {
      var brandName = document.querySelector(".brand-name");
      if (brandName) brandName.textContent = cfg.brandName;
    }
    if (cfg.footerText) {
      var footerText = document.querySelector(".footer-text");
      if (footerText) footerText.textContent = cfg.footerText;
    }
  }

  function replaceBaseUrl() {
    if (!baseUrl || baseUrl === PLACEHOLDER) return;

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var targets = [];
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.indexOf(PLACEHOLDER) !== -1) targets.push(node);
    }
    targets.forEach(function (target) {
      target.nodeValue = target.nodeValue.split(PLACEHOLDER).join(baseUrl);
    });
  }

  function updateCopyButtons(copied) {
    document.querySelectorAll(".copy-btn").forEach(function (btn) {
      btn.textContent = translate(copied ? "ui.copied" : "ui.copy");
      btn.setAttribute("aria-label", translate("ui.copyCode"));
    });
  }

  function updateLanguageControls() {
    var current = document.querySelector("[data-current-lang]");
    if (current) current.textContent = currentLanguage === "zh-CN" ? "ZH" : "EN";

    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      var active = btn.getAttribute("data-set-lang") === currentLanguage;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  var languageToggle = document.getElementById("languageToggle");
  var languageMenu = document.getElementById("languageMenu");

  function closeLanguageMenu() {
    if (!languageMenu || !languageToggle) return;
    languageMenu.hidden = true;
    languageToggle.setAttribute("aria-expanded", "false");
  }

  if (languageToggle && languageMenu) {
    languageToggle.addEventListener("click", function () {
      var open = languageMenu.hidden;
      languageMenu.hidden = !open;
      languageToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".language-switch")) closeLanguageMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeLanguageMenu();
    });
  }

  document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-set-lang");
      if (!dictionaries[lang]) return;
      storeLanguage(lang);
      applyLanguage(lang);
      closeLanguageMenu();
    });
  });

  var themeToggle = document.getElementById("themeToggle");
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("botapi-theme", theme);
    } catch (e) {}
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var btns = group.querySelectorAll(".tab-btn");
    var panels = group.querySelectorAll(".tab-panel");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        btns.forEach(function (b) { b.classList.toggle("active", b === btn); });
        panels.forEach(function (p) {
          p.classList.toggle("active", p.getAttribute("data-lang") === lang);
        });
      });
    });
  });

  document.querySelectorAll(".tab-panel").forEach(function (panel) {
    var pre = panel.querySelector("pre");
    if (!pre) return;
    panel.style.position = "relative";

    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = translate("ui.copy");
    btn.setAttribute("aria-label", translate("ui.copyCode"));

    btn.addEventListener("click", function () {
      var text = pre.innerText;
      var done = function () {
        btn.classList.add("copied");
        btn.textContent = translate("ui.copied");
        setTimeout(function () {
          btn.classList.remove("copied");
          btn.textContent = translate("ui.copy");
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });

    panel.appendChild(btn);
  });

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch (e) {}
    document.body.removeChild(ta);
  }

  var sidebar = document.getElementById("sidebar");
  var backdrop = document.getElementById("sidebarBackdrop");
  var menuToggle = document.getElementById("menuToggle");
  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("show");
  }
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      if (!sidebar) return;
      var open = sidebar.classList.toggle("open");
      if (backdrop) backdrop.classList.toggle("show", open);
    });
  }
  if (backdrop) backdrop.addEventListener("click", closeSidebar);

  var links = Array.prototype.slice.call(document.querySelectorAll(".toc-link"));
  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 860) closeSidebar();
    });
  });

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });
      var best = null;
      var bestRatio = 0;
      sections.forEach(function (section) {
        var ratio = visible[section.id] || 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = section.id;
        }
      });
      if (best) setActive(best);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5, 1] });

    sections.forEach(function (section) { observer.observe(section); });
  }
})();
