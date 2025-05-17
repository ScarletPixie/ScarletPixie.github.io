const toggle = document.querySelector(".navbar__toggle");
const menu = document.querySelector(".navbar__menu");
const menuLinks = document.querySelectorAll(".navbar__link");
const navBrand = document.querySelector(".navbar__brand");


// TOGGLE NAVBAR MENU ON/OFF
toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("active");
});


// CLOSE MENU AFTER CLICKING ANY LINK
navBrand.addEventListener("click", closeMenu);
menuLinks.forEach((lnk) => {
    lnk.addEventListener("click", closeMenu);
});

function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("active");
}