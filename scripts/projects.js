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
    static #PARENT_TEMPLATE = document.getElementById("project-card-template");
    static #TEMPLATE = this.#PARENT_TEMPLATE.content.getElementById("card-tech-stack-item");
    static #ICON_REPO_REF = getTechIcons();

    #node = null;
    #techName = null;
    constructor(techName, url = '#')
    {
        this.#node = CardStackComponent.#TEMPLATE.content.cloneNode(true);
        this.#node.querySelector(".project-list__card-tech-stack-link").href = url;
        this.#node.querySelector(".project-list__card-tech-stack-link-text").textContent = techName;
        this.#node.querySelector(".project-list__card-tech-stack-icon").src = CardStackComponent.#ICON_REPO_REF.get(techName).src;
        this.#techName = techName;
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

    get node()
    {
        return this.#node;
    }

    get techName()
    {
        return this.#techName;
    }
}

export class ProjectCardComponent
{
    static #TEMPLATE = document.getElementById("project-card-template");

    #rawData = null;
    #node = null;
    #stackListNode = null;
    #stack = null;

    constructor(rawData)
    {
        this.#rawData = rawData;
        this.#stack = []

        this.#node = ProjectCardComponent.#TEMPLATE.content.cloneNode(true);
        this.#node.querySelector(".project-list__card-title").textContent = rawData.title;
        this.#node.querySelector(".project-list__card-thumb").src = rawData.preview.thumbnail;
        this.#node.querySelector(".project-list__card-thumb").alt = rawData.preview.alt;
        this.#node.querySelector(".project-list__card-text").textContent = rawData.preview.summary;
        this.#stackListNode = this.#node.querySelector(".project-list__card-tech-stack");

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

    get node()
    {
        return this.#node;
    }
    get rawData()
    {
        return this.#rawData;
    }
}