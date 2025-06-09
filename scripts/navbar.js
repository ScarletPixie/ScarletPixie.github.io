export class Navbar
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
        this._navbarScrollSensibility = 5;

        this._showNav = this._showNav.bind(this);
        this._closeMenu = this._closeMenu.bind(this);
        this._openMenu = this._openMenu.bind(this);
        this._setMenuIcon = this._setMenuIcon.bind(this);
    }

    setup()
    {
        //this.setHideOnScroll();
        this.setUpToggleButton();
        this.setHideOnLinkClick();
        this.setNavHideShowOnFocus();
    }

    // HIDE NAVBAR ON SCROLL DOWN AND SHOW ON SCROLL UP OR ON ACTIVE NAVBAR ELEMENT
    onScrollY(offset)
    {
        if (window.scrollY < 50)
            this.navbar.classList.remove("hidden");
        else if (offset > this._navbarScrollSensibility && !this._isNavbarSelected)
            this.navbar.classList.add("hidden");
        else if (offset < -(this._navbarScrollSensibility * 0.5))
            this.navbar.classList.remove("hidden");
            
    }

    // TOGGLE NAVBAR MENU
    setUpToggleButton()
    {
        //this.toggle.addEventListener("focus", this._showNav);
        this.toggle.addEventListener("click", () => {
            this._isNavbarSelected = true;
            const expanded = this.toggle.getAttribute("aria-expanded") === "true";
            this.toggle.setAttribute("aria-expanded", String(!expanded));
            this.menu.classList.toggle("active");
            this._setMenuIcon(expanded);

            if (expanded === true)
                this._isNavbarSelected = false;
        });
    }

    // HIDE/SHOW NAVBAR WHEN AN ELEMENT IS FOCUSED OR ALL ELEMENTS HAVE LOST FOCUS
    setNavHideShowOnFocus()
    {
        this.navbar.addEventListener("focusout", () => {
            if (!this.menu.classList.contains("active"))
                this._isNavbarSelected = false;
        });
        this.navbar.addEventListener("focusin", () => {
            this._isNavbarSelected = true;
            this._showNav();
        });
    }

    // CLOSE MENU AFTER CLICKING ANY LINK
    setHideOnLinkClick()
    {
        this.navBrand.addEventListener("click", this._closeMenu);
        this.menuLinks.forEach((lnk) => {
            lnk.addEventListener("click", () => {
                this._isNavbarSelected = false;
                this._closeMenu();
            });
            lnk.addEventListener("focus", this._openMenu);
        });
        // CLOSE MENU IF INNER CHILD WAS SELECTED AND LOST FOCUS
        this.menu.addEventListener("focusout", this._closeMenu);
    }

    // CALLBACKS
    _showNav()
    {
        this.navbar.classList.remove("hidden");
    }
    _closeMenu()
    {
        this.toggle.setAttribute("aria-expanded", "false");
        this.menu.classList.remove("active");
        this._setMenuIcon(true);
    }
    _openMenu()
    {
        //alert("sals");
        //this.toggle.setAttribute("aria-expanded", "true");
        this.menu.classList.add("active");
        this._setMenuIcon(false);
    }

    _setMenuIcon(mode)
    {
        if (mode === true)
            this.toggleIcon.src = "../images/menu/burger-menu.svg";
        else
            this.toggleIcon.src = "../images/menu/x-symbol.svg";
    }
}
