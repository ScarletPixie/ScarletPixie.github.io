const navbar = document.querySelector(".navbar");
const toggle = document.querySelector(".navbar__toggle");
const menu = document.querySelector(".navbar__menu");
const menuLinks = document.querySelectorAll(".navbar__link");
const navBrand = document.querySelector(".navbar__brand");
const toggleIcon = document.querySelector(".navbar__menu-icon")


// HIDE/SHOW ON SCROLL
const sensibility = 75;
let lastScroll = window.scrollY;
window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll > lastScroll && currentScroll > sensibility && !menu.classList.contains("active"))
        navbar.classList.add("hidden");
    else
        navbar.classList.remove("hidden");
    lastScroll = currentScroll;
});


// TOGGLE NAVBAR MENU ON/OFF
toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("active");
    setMenuIcon(expanded);
});


// CLOSE MENU AFTER CLICKING ANY LINK
navBrand.addEventListener("click", closeMenu);
menuLinks.forEach((lnk) => {
    lnk.addEventListener("click", closeMenu);
});

function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("active");
    setMenuIcon(true);
}

function setMenuIcon(mode)
{
    if (mode === true)
        toggleIcon.src = "../images/menu/burger-menu.svg";
    else
        toggleIcon.src = "../images/menu/x-symbol.svg";
}