const navbar = document.querySelector(".navbar");
const toggle = document.querySelector(".navbar__toggle");
const menu = document.querySelector(".navbar__menu");
const menuLinks = document.querySelectorAll(".navbar__link");
const navBrand = document.querySelector(".navbar__brand");
const toggleIcon = document.querySelector(".navbar__menu-icon")


// HIDE/SHOW ON SCROLL
const sensibility = 175;
let lastScroll = window.scrollY;
window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (noNavElementFocus() && currentScroll > lastScroll && currentScroll > sensibility)
        navbar.classList.add("hidden");
    else
        navbar.classList.remove("hidden");
    lastScroll = currentScroll;
});



// TOGGLE NAVBAR MENU ON/OFF
toggle.addEventListener("focus", showNav);
toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("active");
    setMenuIcon(expanded);
});


// CLOSE MENU AFTER CLICKING ANY LINK
navBrand.addEventListener("click", closeMenu);
navBrand.addEventListener("focus", showNav);
menuLinks.forEach((lnk) => {
    lnk.addEventListener("click", closeMenu);
    lnk.addEventListener("focus", showNav);
    lnk.addEventListener("focus", openMenu);
});


// CLOSE MENU IF INNER CHILD WAS SELECTED AND LOST FOCUS
menu.addEventListener("focusout", closeMenu);
navbar.addEventListener("focusout", closeMenu);


// HELPERS
function noNavElementFocus()
{
    // TODO
    return false;
    // return !(navbar.contains(document.activeElement) === document.body);
}


// CALLBACKS
function showNav()
{
    navbar.classList.remove("hidden");
}
function closeMenu()
{
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("active");
    setMenuIcon(true);
}
function openMenu()
{
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.add("active");
    setMenuIcon(false);
}

function setMenuIcon(mode)
{
    if (mode === true)
        toggleIcon.src = "../images/menu/burger-menu.svg";
    else
        toggleIcon.src = "../images/menu/x-symbol.svg";
}
