export const PROJECT_LIST =
    [
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
    css3: "../images/projects/tech-stack-icons/css3.svg"
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
