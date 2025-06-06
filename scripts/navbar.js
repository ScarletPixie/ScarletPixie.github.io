class Navbar
{
    constructor()
    {
        this.navbar = document.querySelector(".navbar");
        this.toggle = document.querySelector(".navbar__toggle");
        this.menu = document.querySelector(".navbar__menu");
        this.menuLinks = document.querySelectorAll(".navbar__link");
        this.navBrand = document.querySelector(".navbar__brand");
        this.toggleIcon = document.querySelector(".navbar__menu-icon");

        this._isNavbarSelected = false;
        this._navbarScrollSensibility = 75;
    }

    setHideOnScroll()
    {
        let lastScroll = window.scrollY;
        window.addEventListener("scroll", () => {
            const currentScroll = window.scrollY;
            if (!this._isNavbarSelected && currentScroll > lastScroll && currentScroll > sensibility)
                navbar.classList.add("hidden");
            else
                navbar.classList.remove("hidden");
            lastScroll = currentScroll;
        });
        return this;
    }
    setUpToggleButton()
    {
        toggle.addEventListener("focus", showNav);
        toggle.addEventListener("click", () => {
            const expanded = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!expanded));
            menu.classList.toggle("active");
            setMenuIcon(expanded);
        });
    }
    setNavHideShowOnFocus()
    {
        this.navbar.addEventListener("focusout", () => {
            closeMenu();
            this._isNavbarSelected = false;
        });
        this.navbar.addEventListener("focusin", () => {
            this._isNavbarSelected = true;
        });
    }
}

const nav = new Navbar();
nav.setHideOnScroll();


// CLOSE MENU AFTER CLICKING ANY LINK
navBrand.addEventListener("click", closeMenu);
navBrand.addEventListener("focus", showNav);
menuLinks.forEach((lnk) => {
    lnk.addEventListener("click", () => {
        isNavselected = false;
        closeMenu();
    });
    lnk.addEventListener("focus", showNav);
    lnk.addEventListener("focus", openMenu);
});


// CLOSE MENU IF INNER CHILD WAS SELECTED AND LOST FOCUS
menu.addEventListener("focusout", closeMenu);


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
