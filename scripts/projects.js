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
export class CardStackComponent
{
    static #ICON_REPO = getTechIcons();
    static #TEMPLATE = document.getElementById("project-card-template").content.querySelector("#card-tech-stack-item");

    #node = null;
    #techName = null;
    constructor(techName, url = '#')
    {
        this.#techName = techName;

        this.#node = CardStackComponent.#TEMPLATE.content.firstElementChild.cloneNode(true);
        this.#node.querySelector(".project-list__card-tech-stack-link").href = url;
        this.#node.querySelector(".project-list__card-tech-stack-link-text").textContent = techName;
        this.#node.querySelector(".project-list__card-tech-stack-icon").src = CardStackComponent.#ICON_REPO.get(techName)?.src ?? "";
    }

    render(element)
    {
        element.appendChild(this.#node);
    }
    destroy()
    {
        this.#node.remove();
        this.#node = null;
    }

    get node() { return this.#node; }
    get techName() { return this.#techName; }
}

export class ProjectCardComponent
{
    static #TEMPLATE = document.getElementById("project-card-template");

    #rawData = null;
    #node = null;
    #windowNode = null;
    #windowButtonsNode = null;
    #imageNodes = null;
    #thumbNode = null
    #stackListNode = null;
    #stack = null;

    constructor(rawData)
    {
        this.#rawData = rawData;
        this.#stack = []

        this.#node = ProjectCardComponent.#TEMPLATE.content.firstElementChild.cloneNode(true);
        this.#node.querySelector(".project-list__card-title").textContent = rawData.title;
        this.#thumbNode = this.#node.querySelector(".project-list__card-thumb");
        this.#thumbNode.src = rawData.preview.thumbnail;
        this.#thumbNode.alt = rawData.preview.alt;
        this.#node.querySelector(".project-list__card-text").textContent = rawData.preview.summary;
        this.#stackListNode = this.#node.querySelector(".project-list__card-tech-stack");

        this.#windowNode = this.#node.querySelector(".project-list__card-frame");
        this.#windowButtonsNode = this.#node.querySelector(".project-list__card-actions");
        this.#imageNodes = this.#node.querySelectorAll("img");

        [...new Set(rawData.preview.stack)].forEach(techName => {
            const cardStack = new CardStackComponent(techName);
            this.#stack.push(cardStack);
            cardStack.render(this.#stackListNode);
        });
    }

    destroy()
    {
        this.#node.remove();
        this.#node = null;
    }
    render(element)
    {
        element.appendChild(this.#node);
    }

    get node() { return this.#node; }
    get thumbNode() { return this.#thumbNode; }
    get windowNode() { return this.#windowNode; }
    get imageNodes() { return this.#imageNodes; }
    get windowButtonsNode() { return this.#windowButtonsNode; }

    get rawData() { return this.#rawData; }
}