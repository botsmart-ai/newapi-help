/* ============================================================
   跨境BotAPI 接入文档 — 交互
   主题切换 / 代码 Tab / 一键复制 / 移动端菜单 / 滚动高亮
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- 主题切换 ---------- */
  var themeToggle = document.getElementById("themeToggle");
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("botapi-theme", theme); } catch (e) {}
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ---------- 代码 Tab 切换 ---------- */
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

  /* ---------- 一键复制（为每个代码面板注入按钮） ---------- */
  document.querySelectorAll(".tab-panel").forEach(function (panel) {
    var pre = panel.querySelector("pre");
    if (!pre) return;
    panel.style.position = "relative";

    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "复制";
    btn.setAttribute("aria-label", "复制代码");

    btn.addEventListener("click", function () {
      var text = pre.innerText;
      var done = function () {
        btn.classList.add("copied");
        btn.textContent = "已复制";
        setTimeout(function () {
          btn.classList.remove("copied");
          btn.textContent = "复制";
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
    try { document.execCommand("copy"); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------- 移动端侧栏 ---------- */
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

  /* ---------- 滚动高亮 + 点击导航 ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc-link"));
  var sections = links
    .map(function (l) { return document.querySelector(l.getAttribute("href")); })
    .filter(Boolean);

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 860) closeSidebar();
    });
  });

  function setActive(id) {
    links.forEach(function (l) {
      l.classList.toggle("active", l.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });
      var best = null, bestRatio = 0;
      sections.forEach(function (s) {
        var r = visible[s.id] || 0;
        if (r > bestRatio) { bestRatio = r; best = s.id; }
      });
      if (best) setActive(best);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5, 1] });

    sections.forEach(function (s) { observer.observe(s); });
  }
})();
