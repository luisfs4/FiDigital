"use strict";
! function () {
  if (navigator.platform.indexOf("Win") > -1) {
    if (document.getElementsByClassName("main-content")[0]) {
      var e = document.querySelector(".main-content");
      new PerfectScrollbar(e)
    }
    if (document.getElementsByClassName("sidenav")[0]) {
      var t = document.querySelector(".sidenav");
      new PerfectScrollbar(t)
    }
    if (document.getElementsByClassName("navbar-collapse")[0]) {
      var n = document.querySelector(".navbar:not(.navbar-expand-lg) .navbar-collapse");
      fixedPlugin && new PerfectScrollbar(n)
    }
    document.getElementsByClassName("fixed-plugin")[0] && (n = document.querySelector(".fixed-plugin"), new PerfectScrollbar(n))
  }
}(), navbarBlurOnScroll("navbarBlur");
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')),
  tooltipList = tooltipTriggerList.map((function (e) {
    return new bootstrap.Tooltip(e)
  }));

function focused(e) {
  e.parentElement.classList.contains("input-group") && e.parentElement.classList.add("focused")
}

function defocused(e) {
  e.parentElement.classList.contains("input-group") && e.parentElement.classList.remove("focused")
}

function setAttributes(e, t) {
  Object.keys(t).forEach((function (n) {
    e.setAttribute(n, t[n])
  }))
}
if (0 != document.querySelectorAll(".input-group").length) {
  var allInputs = document.querySelectorAll("input.form-control");
  allInputs.forEach((e => setAttributes(e, {
    onfocus: "focused(this)",
    onfocusout: "defocused(this)"
  })))
}
if (document.querySelector(".fixed-plugin")) {
  var fixedPlugin = document.querySelector(".fixed-plugin"),
    fixedPluginButton = document.querySelector(".fixed-plugin-button"),
    fixedPluginButtonNav = document.querySelector(".fixed-plugin-button-nav"),
    fixedPluginCard = document.querySelector(".fixed-plugin .card"),
    fixedPluginCloseButton = document.querySelectorAll(".fixed-plugin-close-button"),
    navbar = document.getElementById("navbarBlur"),
    buttonNavbarFixed = document.getElementById("navbarFixed");
  fixedPluginButton && (fixedPluginButton.onclick = function () {
    fixedPlugin.classList.contains("show") ? fixedPlugin.classList.remove("show") : fixedPlugin.classList.add("show")
  }), fixedPluginButtonNav && (fixedPluginButtonNav.onclick = function () {
    fixedPlugin.classList.contains("show") ? fixedPlugin.classList.remove("show") : fixedPlugin.classList.add("show")
  }), fixedPluginCloseButton.forEach((function (e) {
    e.onclick = function () {
      fixedPlugin.classList.remove("show")
    }
  })), document.querySelector("body").onclick = function (e) {
    e.target != fixedPluginButton && e.target != fixedPluginButtonNav && e.target.closest(".fixed-plugin .card") != fixedPluginCard && fixedPlugin.classList.remove("show")
  }, navbar && "true" == navbar.getAttribute("navbar-scroll") && buttonNavbarFixed.setAttribute("checked", "true")
}

function getEventTarget(e) {
  return (e = e || window.event).target || e.srcElement
}

function sidebarColor(e) {
  for (var t = e.parentElement.children, n = e.getAttribute("data-color"), i = 0; i < t.length; i++) t[i].classList.remove("active");
  if (e.classList.contains("active") ? e.classList.remove("active") : e.classList.add("active"), document.querySelector(".sidenav").setAttribute("data-color", n), document.querySelector("#sidenavCard")) {
    var a = document.querySelector("#sidenavCard");
    let e = ["card", "card-background", "shadow-none", "card-background-mask-" + n];
    a.className = "", a.classList.add(...e);
    var s = document.querySelector("#sidenavCardIcon");
    let t = ["ni", "ni-diamond", "text-gradient", "text-lg", "top-0", "text-" + n];
    s.className = "", s.classList.add(...t)
  }
}

function navbarFixed(e) {
  let t = ["position-sticky", "blur", "shadow-blur", "mt-4", "left-auto", "top-1", "z-index-sticky"];
  const n = document.getElementById("navbarBlur");
  e.getAttribute("checked") ? (n.classList.remove(...t), n.setAttribute("navbar-scroll", "false"), navbarBlurOnScroll("navbarBlur"), e.removeAttribute("checked")) : (n.classList.add(...t), n.setAttribute("navbar-scroll", "true"), navbarBlurOnScroll("navbarBlur"), e.setAttribute("checked", "true"))
}

function navbarBlurOnScroll(e) {
  const t = document.getElementById(e);
  let n = !!t && t.getAttribute("navbar-scroll"),
    i = ["position-sticky", "blur", "shadow-blur", "mt-4", "left-auto", "top-1", "z-index-sticky"],
    a = ["shadow-none"];

  function s() {
    t && (t.classList.remove(...i), t.classList.add(...a), o("transparent"))
  }

  function o(e) {
    let t = document.querySelectorAll(".navbar-main .nav-link"),
      n = document.querySelectorAll(".navbar-main .sidenav-toggler-line");
    "blur" === e ? (t.forEach((e => {
      e.classList.remove("text-body")
    })), n.forEach((e => {
      e.classList.add("bg-dark")
    }))) : "transparent" === e && (t.forEach((e => {
      e.classList.add("text-body")
    })), n.forEach((e => {
      e.classList.remove("bg-dark")
    })))
  }
  window.onscroll = debounce("true" == n ? function () {
    window.scrollY > 5 ? (t.classList.add(...i), t.classList.remove(...a), o("blur")) : s()
  } : function () {
    s()
  }, 10)
}

function debounce(e, t, n) {
  var i;
  return function () {
    var a = this,
      s = arguments,
      o = function () {
        i = null, n || e.apply(a, s)
      },
      l = n && !i;
    clearTimeout(i), i = setTimeout(o, t), l && e.apply(a, s)
  }
}

function sidebarType(e) {
  for (var t = e.parentElement.children, n = e.getAttribute("data-class"), i = [], a = 0; a < t.length; a++) t[a].classList.remove("active"), i.push(t[a].getAttribute("data-class"));
  e.classList.contains("active") ? e.classList.remove("active") : e.classList.add("active");
  var s = document.querySelector(".sidenav");
  for (a = 0; a < i.length; a++) s.classList.remove(i[a]);
  s.classList.add(n)
}
total.forEach((function (e, t) {
  let n = document.createElement("div"),
    i = e.querySelector("li:first-child .nav-link").cloneNode();
  i.innerHTML = "-", i.removeAttribute("id"), i.removeAttribute("data-bs-toggle"), i.removeAttribute("href"), i.removeAttribute("contenido"), i.removeAttribute("role"), i.removeAttribute("aria-controls"), i.removeAttribute("aria-label"), i.removeAttribute("aria-selected"), n.classList.add("moving-tab", "position-absolute", "nav-link", "mt-1"), n.appendChild(i), e.appendChild(n), n.setAttribute("role", "none"), n.removeAttribute("tabindex"), n.removeAttribute("aria-selected"), e.getElementsByTagName("li").length, n.style.padding = "0px", n.style.width = e.querySelector("li:nth-child(1)").offsetWidth + "px", n.style.transform = "translate3d(0px, 0px, 0px)", n.style.transition = ".5s ease", e.onmouseover = function (t) {
    let i = getEventTarget(t).closest("li");
    if (i) {
      let t = Array.from(i.closest("ul").children),
        a = t.indexOf(i) + 1;
      e.querySelector("li:nth-child(" + a + ") .nav-link").onclick = function () {
        n = e.querySelector(".moving-tab");
        let s = 0;
        if (e.classList.contains("flex-column")) {
          for (var o = 1; o <= t.indexOf(i); o++) s += e.querySelector("li:nth-child(" + o + ")").offsetHeight;
          n.style.transform = "translate3d(0px," + s + "px, 0px)", n.style.height = e.querySelector("li:nth-child(" + o + ")").offsetHeight
        } else {
          for (o = 1; o <= t.indexOf(i); o++) s += e.querySelector("li:nth-child(" + o + ")").offsetWidth;
          n.style.transform = "translate3d(" + s + "px, 0px, 0px)", n.style.width = e.querySelector("li:nth-child(" + a + ")").offsetWidth + "px"
        }
      }
    }
  }
})), window.addEventListener("resize", (function (e) {
  resize_moving_tab()
}));
const iconNavbarSidenav = document.getElementById("iconNavbarSidenav"),
  iconSidenav = document.getElementById("iconSidenav"),
  sidenav = document.getElementById("sidenav-main");
let body = document.getElementsByTagName("body")[0],
  className = "g-sidenav-pinned";

function toggleSidenav() {
  body.classList.contains(className) ? (body.classList.remove(className), setTimeout((function () {
    sidenav.classList.remove("bg-white")
  }), 100), sidenav.classList.remove("bg-transparent")) : (body.classList.add(className), sidenav.classList.add("bg-white"), sidenav.classList.remove("bg-transparent"), iconSidenav.classList.remove("d-none"))
}
iconNavbarSidenav && iconNavbarSidenav.addEventListener("click", toggleSidenav), iconSidenav && iconSidenav.addEventListener("click", toggleSidenav);
let referenceButtons = document.querySelector("[data-class]");

function navbarColorOnResize() {
  referenceButtons && (window.innerWidth > 1200 ? referenceButtons.classList.contains("active") && "bg-transparent" === referenceButtons.getAttribute("data-class") ? sidenav.classList.remove("bg-white") : sidenav.classList.add("bg-white") : (sidenav.classList.add("bg-white"), sidenav.classList.remove("bg-transparent")))
}

function sidenavTypeOnResize() {
  let e = document.querySelectorAll('[onclick="sidebarType(this)"]');
  window.innerWidth < 1200 ? e.forEach((function (e) {
    e.classList.add("disabled")
  })) : e.forEach((function (e) {
    e.classList.remove("disabled")
  }))
}
window.addEventListener("resize", navbarColorOnResize), window.addEventListener("resize", sidenavTypeOnResize), window.addEventListener("load", sidenavTypeOnResize);
const resize_moving_tab = () => {
  let e = document.querySelectorAll(".nav-pills");
  e.forEach((function (e, t) {
    e.querySelector(".moving-tab").remove();
    var n = document.createElement("li"),
      i = e.querySelector(".nav-link.active").cloneNode();
    i.innerHTML = "-", n.classList.add("moving-tab", "position-absolute", "nav-item", "py-1"), n.appendChild(i), e.appendChild(n), n.style.padding = "0px", n.style.transition = ".5s ease";
    let a = e.querySelector(".nav-link.active").parentElement;
    if (a) {
      let t = Array.from(a.closest("ul").children),
        i = t.indexOf(a) + 1,
        o = 0;
      if (e.classList.contains("flex-column")) {
        for (var s = 1; s <= t.indexOf(a); s++) o += e.querySelector("li:nth-child(" + s + ")").offsetHeight;
        n.style.transform = "translate3d(0px," + o + "px, 0px)", n.style.width = e.querySelector("li:nth-child(" + i + ")").offsetWidth + "px", n.style.height = e.querySelector("li:nth-child(" + s + ")").offsetHeight
      } else {
        for (s = 1; s <= t.indexOf(a); s++) o += e.querySelector("li:nth-child(" + s + ")").offsetWidth;
        n.style.transform = "translate3d(" + o + "px, 0px, 0px)", n.style.width = e.querySelector("li:nth-child(" + i + ")").offsetWidth + "px"
      }
    }
  })), window.innerWidth < 991 ? e.forEach((function (e, t) {
    e.classList.contains("flex-column") || e.classList.add("flex-column", "on-resize")
  })) : e.forEach((function (e, t) {
    e.classList.contains("on-resize") && e.classList.remove("flex-column", "on-resize")
  }))
};