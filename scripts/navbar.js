const toggle = document.querySelector(".navbar__toggle");
const menu = document.querySelector(".navbar__menu");
const menuLinks = document.querySelectorAll(".navbar__link");
const navBrand = document.querySelector(".navbar__brand");
const toggleIcon = document.querySelector(".navbar__menu-icon")


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
    setMenuIcon(false);
}

function setMenuIcon(mode)
{
    if (mode === true)
        toggleIcon.src = "../images/menu/burger-menu.svg";
    else
        toggleIcon.src = "../images/menu/x-symbol.svg";
}