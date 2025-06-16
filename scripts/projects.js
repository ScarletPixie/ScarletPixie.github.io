import { Component } from "./utils.js"

export const PROJECT_LIST =
    [
        // COUNTRY INFO
        {
            title: "Country Info",
            url: "https://scarletpixie.github.io/country-info",
            preview: {
                summary: "A simple frontend project about fetching data from an external API",
                thumbnail: "../images/projects/country-info/dark-theme-home-page.png",
                stack: ["html5", "css3", "javascript"],
            },
            images: [],
            description: "lorem ipsum",
        },

        // STARSHIP42
        {
            title: "Starship42",
            url: "http://starship.42.rio/auth/login",
            preview: {
                summary: "A moderately complex project about centralizing the functionalities of several platforms into one",
                thumbnail: "../images/projects/starship42/starship42.png",
                stack: ["python", "django", "djangorestframework", "docker"],
            },
            images: [],
            description: "lorem ipsum",
        },

        // MOCKS
        {
            title: "Country Info",
            url: "https://scarletpixie.github.io/country-info",
            preview: {
                summary: "A simple project about fetching data from an external API",
                thumbnail: "../images/projects/country-info/dark-theme-home-page.png",
                stack: ["html5", "css3", "javascript"],
            },
            images: [],
            description: "lorem ipsum",
        },
        {
            title: "Country Info",
            url: "https://scarletpixie.github.io/country-info",
            preview: {
                summary: "A simple project about fetching data from an external API",
                thumbnail: "../images/projects/country-info/dark-theme-home-page.png",
                stack: ["html5", "css3", "javascript"],
            },
            images: [],
            description: "lorem ipsum",
        },
        {
            title: "Country Info",
            url: "https://scarletpixie.github.io/country-info",
            preview: {
                summary: "A simple project about fetching data from an external API",
                thumbnail: "../images/projects/country-info/dark-theme-home-page.png",
                stack: ["html5", "css3", "javascript"],
            },
            images: [],
            description: "lorem ipsum",
        },
        {
            title: "Country Info",
            url: "https://scarletpixie.github.io/country-info",
            preview: {
                summary: "A simple project about fetching data from an external API",
                thumbnail: "../images/projects/country-info/dark-theme-home-page.png",
                stack: ["html5", "css3", "javascript"],
            },
            images: [],
            description: "lorem ipsum",
        },
        {
            title: "Country Info",
            url: "https://scarletpixie.github.io/country-info",
            preview: {
                summary: "A simple project about fetching data from an external API",
                thumbnail: "../images/projects/country-info/dark-theme-home-page.png",
                stack: ["html5", "css3", "javascript"],
            },
            images: [],
            description: "lorem ipsum",
        },
        {
            title: "Country Info",
            url: "https://scarletpixie.github.io/country-info",
            preview: {
                summary: "A simple project about fetching data from an external API",
                thumbnail: "../images/projects/country-info/dark-theme-home-page.png",
                stack: ["html5", "css3", "javascript"],
            },
            images: [],
            description: "lorem ipsum",
        },
        {
            title: "Country Info",
            url: "https://scarletpixie.github.io/country-info",
            preview: {
                summary: "A simple project about fetching data from an external API",
                thumbnail: "../images/projects/country-info/dark-theme-home-page.png",
                stack: ["html5", "css3", "javascript"],
            },
            images: [],
            description: "lorem ipsum",
        },
        {
            title: "Country Info",
            url: "https://scarletpixie.github.io/country-info",
            preview: {
                summary: "A simple project about fetching data from an external API",
                thumbnail: "../images/projects/country-info/dark-theme-home-page.png",
                stack: ["html5", "css3", "javascript"],
            },
            images: [],
            description: "lorem ipsum",
        },
    ]

// techIcons.js
const techList = {
    javascript: "../images/projects/tech-stack-icons/javascript.svg",
    html5: "../images/projects/tech-stack-icons/html5.svg",
    css3: "../images/projects/tech-stack-icons/css3.svg",
    django: "../images/projects/tech-stack-icons/django.svg",
    djangorestframework: "../images/projects/tech-stack-icons/django-rest.svg",
    python: "../images/projects/tech-stack-icons/python.svg",
    docker: "../images/projects/tech-stack-icons/docker.svg",
  };
  
  
let techIcons = null;
export function getTechIcons()
{
    if (techIcons)
        return techIcons;
    techIcons = new Map();
    for (const [name, path] of Object.entries(techList))
    {
        const img = new Image();
        img.src = path;
        img.alt = "";
        img.setAttribute("aria-hidden", "true");
        img.setAttribute("role", "presentation");
        techIcons.set(name, img);
    }
    return techIcons;
}


// TEMPLATE CLASSES
export class CardStackComponent extends Component
{
    static #ICON_REPO = getTechIcons();
    static #TEMPLATE = document.getElementById("project-card-template").content.querySelector("#card-tech-stack-item");

    #techName = null;
    constructor(techName, url = '#')
    {
        const clone = CardStackComponent.#TEMPLATE.content.firstElementChild.cloneNode(true);
        super(clone);

        this.#techName = techName;

        this._node.querySelector(".project-list__card-tech-stack-link").href = url;
        this._node.querySelector(".project-list__card-tech-stack-link-text").textContent = techName;
        this._node.querySelector(".project-list__card-tech-stack-icon").src = CardStackComponent.#ICON_REPO.get(techName)?.src ?? "";
    }

    get node() { return this._node; }
    get techName() { return this.#techName; }
}

export class ProjectCardComponent extends Component
{
    static #TEMPLATE = document.getElementById("project-card-template");

    #rawData = null;
    #windowNode = null;
    #windowButtonsNode = null;
    #imageNodes = null;
    #thumbNode = null
    #stackListNode = null;
    #stack = null;

    constructor(rawData)
    {
        const clone = ProjectCardComponent.#TEMPLATE.content.firstElementChild.cloneNode(true);
        super(clone);

        this.#rawData = rawData;
        this.#stack = []

        this._node.querySelector(".project-list__card-title").textContent = rawData.title;
        this.#thumbNode = this._node.querySelector(".project-list__card-thumb");
        this.#thumbNode.src = rawData.preview.thumbnail;
        this.#thumbNode.alt = rawData.preview.alt;
        this._node.querySelector(".project-list__card-text").textContent = rawData.preview.summary;
        this.#stackListNode = this._node.querySelector(".project-list__card-tech-stack");

        this.#windowNode = this._node.querySelector(".project-list__card-frame");
        this.#windowButtonsNode = this._node.querySelector(".project-list__card-actions");
        this.#imageNodes = this._node.querySelectorAll("img");

        [...new Set(rawData.preview.stack)].forEach(techName => {
            const cardStack = new CardStackComponent(techName);
            this.#stack.push(cardStack);
            cardStack.render(this.#stackListNode);
        });
    }

    get node() { return this._node; }
    get thumbNode() { return this.#thumbNode; }
    get windowNode() { return this.#windowNode; }
    get imageNodes() { return this.#imageNodes; }
    get windowButtonsNode() { return this.#windowButtonsNode; }

    get rawData() { return this.#rawData; }
}