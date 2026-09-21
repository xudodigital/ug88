
var CDN = "assets";

if (document.getElementById("bannerTrack")) {

var categoryRow = document.querySelector(".category-grid");
var categoryCards = Array.prototype.slice.call(categoryRow.children);
var prevBtn = document.querySelector(".cat-prev");
var nextBtn = document.querySelector(".cat-next");
var scrollThumb = document.querySelector(".cat-scrollbar-stick");

function categoryStep() {
  var gap = parseFloat(getComputedStyle(categoryRow).gap) || 0;
  return categoryCards[0].getBoundingClientRect().width + gap;
}

function updateCategory() {
  var step = categoryStep();
  var max = categoryRow.scrollWidth - categoryRow.clientWidth;

  var activeIndex = Math.round(categoryRow.scrollLeft / step);

  categoryCards.forEach(function (k, i) {
    k.classList.toggle("active", i === activeIndex);
  });

  prevBtn.disabled = categoryRow.scrollLeft <= 1;
  nextBtn.disabled = categoryRow.scrollLeft >= max - 1;

  var progress = max > 0 ? categoryRow.scrollLeft / max : 0;
  scrollThumb.style.left = (progress * (100 - 28)) + "%";
}

function slideCategory(dir) {
  categoryRow.scrollBy({ left: dir * categoryStep(), behavior: "smooth" });
}

prevBtn.addEventListener("click", function () { slideCategory(-1); });
nextBtn.addEventListener("click", function () { slideCategory(1); });

categoryRow.addEventListener("scroll", updateCategory);
window.addEventListener("resize", updateCategory);
updateCategory();

var promoRow = document.getElementById("promoRow");
var promoPrevBtn = document.querySelector(".promo-prev");
var promoNextBtn = document.querySelector(".promo-next");

var CLONES = 3;

var promoOriginals = Array.prototype.slice.call(promoRow.children);
var PROMO_COUNT = promoOriginals.length;

promoOriginals.slice(-CLONES).reverse().forEach(function (k) {
  promoRow.insertBefore(k.cloneNode(true), promoRow.firstChild);
});
promoOriginals.slice(0, CLONES).forEach(function (k) {
  promoRow.appendChild(k.cloneNode(true));
});

var promoIndex = CLONES;

function promoStep() {
  var gap = parseFloat(getComputedStyle(promoRow).gap) || 0;
  return promoRow.children[0].getBoundingClientRect().width + gap;
}

function setPromoPosition(animated) {
  promoRow.style.transition = animated ? "" : "none";
  promoRow.style.transform = "translateX(-" + (promoIndex * promoStep()) + "px)";
}

function slidePromo(dir) {
  promoIndex += dir;
  setPromoPosition(true);
}

promoRow.addEventListener("transitionend", function (e) {
  if (e.propertyName !== "transform") return;
  if (promoIndex >= PROMO_COUNT + CLONES) {
    promoIndex -= PROMO_COUNT;
    setPromoPosition(false);
  } else if (promoIndex < CLONES) {
    promoIndex += PROMO_COUNT;
    setPromoPosition(false);
  }
});

promoPrevBtn.addEventListener("click", function () { slidePromo(-1); });
promoNextBtn.addEventListener("click", function () { slidePromo(1); });

function resetPromo() {
  if (promoIndex < PROMO_COUNT + CLONES) return;
  promoIndex -= PROMO_COUNT;
  setPromoPosition(false);
  void promoRow.offsetWidth;
}

function autoPromo() {
  if (document.hidden) return;
  resetPromo();
  slidePromo(1);
}

setInterval(autoPromo, 2500);

document.addEventListener("visibilitychange", function () {
  if (!document.hidden) resetPromo();
});

window.addEventListener("resize", function () { setPromoPosition(false); });

setPromoPosition(false);

var track = document.getElementById("bannerTrack");
var slideCount = track.children.length;

track.appendChild(track.children[0].cloneNode(true));

var activeSlide = 0;

function goToSlide(i, animated) {
  activeSlide = i;

  track.style.transition = animated ? "" : "none";
  track.style.transform  = "translateX(-" + (i * 100) + "%)";
}

function resetBanner() {
  if (activeSlide < slideCount) return;
  goToSlide(0, false);
  void track.offsetWidth;
}

function autoBanner() {
  if (document.hidden) return;
  resetBanner();
  goToSlide(activeSlide + 1, true);
}

setInterval(autoBanner, 2500);

document.addEventListener("visibilitychange", function () {
  if (!document.hidden) resetBanner();
});

track.addEventListener("transitionend", function (e) {
  if (e.propertyName !== "transform") return;
  if (activeSlide === slideCount) {
    goToSlide(0, false);
  }
});

}

var topBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", function () {
  topBtn.classList.toggle("show", window.scrollY > 300);
});

topBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("navList").addEventListener("click", function (e) {
  var head = e.target.closest(".nav-head");
  if (!head) return;

  var parent = head.closest(".nav-toggle");
  if (!parent.querySelector(".nav-sub")) return;

  e.preventDefault();
  parent.classList.toggle("open");
});

var menuBtn   = document.querySelector(".menu-btn");
var sidebarBackdropEl = document.getElementById("sidebarBackdrop");

menuBtn.addEventListener("click", function () {
  document.body.classList.toggle("sidebar-open");
});

sidebarBackdropEl.addEventListener("click", function () {
  document.body.classList.remove("sidebar-open");
});

var tabMenu = document.getElementById("tabMenu");

tabMenu.addEventListener("click", function () {
  document.body.classList.toggle("sidebar-open");
  markTabMenu();
});

function markTabMenu() {
  tabMenu.classList.toggle("active", document.body.classList.contains("sidebar-open"));
}

menuBtn.addEventListener("click", markTabMenu);
sidebarBackdropEl.addEventListener("click", markTabMenu);
markTabMenu();

var panelQuery = window.matchMedia("(max-width: 1279px)");
var wasNarrow = panelQuery.matches;

function syncSidebar() {
  var narrow = panelQuery.matches;
  if (narrow === wasNarrow) return;
  wasNarrow = narrow;
  document.body.classList.toggle("sidebar-open", !narrow);
  markTabMenu();
}

panelQuery.addEventListener("change", syncSidebar);
window.addEventListener("resize", syncSidebar);

if (window.ResizeObserver) {
  new ResizeObserver(syncSidebar).observe(document.documentElement);
}

var themeBtns = Array.prototype.slice.call(document.querySelectorAll(".theme-row button"));

var BADGE_DARK  = CDN + "/_next/static/media/Exclusive-Icon-Dark-Theme.9661459c.svg";
var BADGE_LIGHT = CDN + "/_next/static/media/Exclusive-Icon-Light-Theme.80243ec9.svg";

function swapThemeImages(themeName) {
  var folder = themeName === "light" ? "light" : "dark";
  document.querySelectorAll('img[src*="/providerLogo/"]').forEach(function (img) {
    img.src = img.src.replace(/\/providerLogo\/(dark|light)\//, "/providerLogo/" + folder + "/");
  });
  document.querySelectorAll('img[src*="Exclusive-Icon"]').forEach(function (img) {
    img.src = themeName === "light" ? BADGE_LIGHT : BADGE_DARK;
  });
}

function applyTheme(themeName) {
  document.documentElement.classList.toggle("light", themeName === "light");

  themeBtns.forEach(function (b) {
    var ownTheme = b.getAttribute("data-theme");
    b.classList.toggle("active", ownTheme === themeName);
  });
  swapThemeImages(themeName);
  try { localStorage.setItem("theme", themeName); } catch (e) {  }
}

themeBtns.forEach(function (b) {
  b.addEventListener("click", function () {
    applyTheme(b.getAttribute("data-theme"));
  });
});

(function () {
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  applyTheme(saved === "light" ? "light" : "dark");
})();

var yearSpan = document.getElementById("currentYear");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

var modalLogin = document.getElementById("modalLogin");
var closeModalTimer = null;

function openModal() {
  if (!modalLogin) return;
  clearTimeout(closeModalTimer);
  modalLogin.hidden = false;
  void modalLogin.offsetWidth;
  modalLogin.classList.add("visible");
}

function closeModal() {
  if (!modalLogin) return;
  modalLogin.classList.remove("visible");
  closeModalTimer = setTimeout(function () { modalLogin.hidden = true; }, 300);
}

if (modalLogin) {
  modalLogin.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]") === e.target || e.target.closest(".modal-close")) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modalLogin.hidden) closeModal();
  });
}

var SITE   = "https://ug88vnd.co";
var OWN_HOME = "/";
var SIGNUP_PATH = "/vi/sign-up";

var REF_QUERY = "refId=RFVU60USY&keyword=TeamAkang";

function refUrl(path) {
  return SITE + path + (path.indexOf("?") === -1 ? "?" : "&") + REF_QUERY;
}

function key(t) { return (t || "").trim().toLowerCase(); }

var PAID_LINKS = true;

function trackCta(el, path) {
  if (typeof gtag !== "function") return;
  var label = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
  gtag("event", "cta_click", {
    cta_label: label || "(tanpa teks)",
    cta_path: path,
    cta_signup: path === SIGNUP_PATH
  });
}

function linkTo(el, path) {
  if (!el) return;
  var url = refUrl(path);
  if (el.tagName === "A") {
    el.setAttribute("href", url);
    if (PAID_LINKS) el.setAttribute("rel", "sponsored");
    el.addEventListener("click", function () { trackCta(el, path); });
    return;
  }
  el.style.cursor = "pointer";
  el.addEventListener("click", function () {
    trackCta(el, path);
    window.location.href = url;
  });
}

function toModal(el) {
  if (!el) return;
  el.removeAttribute("href");
  el.style.cursor = "pointer";
  el.addEventListener("click", function (e) {
    e.preventDefault();
    openModal();
  });
}

Array.prototype.forEach.call(document.querySelectorAll("#navList > li"), function (li) {
  var label = key((li.querySelector(".nav-label") || {}).textContent);
  var link = li.querySelector(".nav-link");
  var hasSub = !!li.querySelector(".nav-sub");

  if (hasSub) {
    link.removeAttribute("href");
  } else if (label === "trang chủ") {
    linkTo(link, SIGNUP_PATH);
  } else {
    toModal(link);
  }

  Array.prototype.forEach.call(li.querySelectorAll(".nav-sub a, .nav-sub .sub-link"), toModal);
});

Array.prototype.forEach.call(document.querySelectorAll(".modal-login, .modal-register"), function (b) {
  linkTo(b, SIGNUP_PATH);
});

Array.prototype.forEach.call(document.querySelectorAll(".category-card"), function (a) {
  linkTo(a, SIGNUP_PATH);
});

Array.prototype.forEach.call(document.querySelectorAll(".game-item"), function (a) {
  linkTo(a, SIGNUP_PATH);
});

Array.prototype.forEach.call(document.querySelectorAll(".page-cta-btn"), function (a) {
  linkTo(a, SIGNUP_PATH);
});

Array.prototype.forEach.call(document.querySelectorAll(".provider-tile"), function (b) { linkTo(b, SIGNUP_PATH); });
Array.prototype.forEach.call(document.querySelectorAll(".promo-card"),    function (d) { linkTo(d, SIGNUP_PATH); });
document.querySelector(".header-left a").setAttribute("href", OWN_HOME);
linkTo(document.querySelector(".btn-login"),     SIGNUP_PATH);
linkTo(document.querySelector(".btn-register"),  SIGNUP_PATH);

Array.prototype.forEach.call(document.querySelectorAll(".tabbar button"), function (b) {
  if (b.id !== "tabMenu") toModal(b);
});

(function () {
  var box = document.querySelector(".footer-brand .brand-box");
  if (!box || box.closest("a")) return;
  var a = document.createElement("a");
  a.setAttribute("href", OWN_HOME);
  box.parentNode.insertBefore(a, box);
  a.appendChild(box);
})();

  window.__lc = window.__lc || {};
  window.__lc.license = 13294242;
  ;(function (n, t, c) {
    function i(n) { return e._h ? e._h.apply(null, n) : e._q.push(n) }
    var e = {
      _q: [], _h: null, _v: "2.0",
      on:   function () { i(["on",   c.call(arguments)]) },
      once: function () { i(["once", c.call(arguments)]) },
      off:  function () { i(["off",  c.call(arguments)]) },
      get:  function () {
        if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
        return i(["get", c.call(arguments)]);
      },
      call: function () { i(["call", c.call(arguments)]) },
      init: function () {
        var n = t.createElement("script");
        n.async = !0; n.type = "text/javascript";
        n.src = "https://cdn.livechatinc.com/tracking.js";
        t.head.appendChild(n);
      }
    };
    !n.__lc.asyncInit && e.init();
    n.LiveChatWidget = n.LiveChatWidget || e;
  }(window, document, [].slice));

(function () {
  var fallback = document.querySelector(".chat-button");
  var poll = setInterval(function () {
    if (document.getElementById("chat-widget-container")) {
      fallback.style.display = "none";
      clearInterval(poll);
    }
  }, 500);
  setTimeout(function () { clearInterval(poll); }, 15000);
})();
