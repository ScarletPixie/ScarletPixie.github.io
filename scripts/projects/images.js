let techIcons = null;
let techLinks = null;
const techList = {
    javascript: "../images/projects/tech-stack-icons/javascript.svg",
    html5: "../images/projects/tech-stack-icons/html5.svg",
    css3: "../images/projects/tech-stack-icons/css3.svg",
    django: "../images/projects/tech-stack-icons/django.svg",
    djangorestframework: "../images/projects/tech-stack-icons/django-rest.svg",
    python: "../images/projects/tech-stack-icons/python.svg",
    docker: "../images/projects/tech-stack-icons/docker.svg",
    linkedin: "../images/projects/tech-stack-icons/linkedin.svg",
    github: "..../images/projects/tech-stack-icons/github.svg",
};
const techLinkList = {
    javascript: "https://pt.m.wikipedia.org/wiki/JavaScript",
    html5: "https://pt.m.wikipedia.org/wiki/HTML5",
    css3: "https://pt.m.wikipedia.org/wiki/CSS3",
    django: "https://www.djangoproject.com/",
    djangorestframework: "https://www.django-rest-framework.org/",
    python: "https://www.python.org/",
    docker: "https://www.docker.com/",
    linkedin: "#",
    github: "#",
}
  
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
export function getTechLinks()
{
    if (techLinks)
        return techLinks;
    techLinks = new Map();
    for (const [name, url] of Object.entries(techLinkList))
    {
        techLinks.set(name, url);
    }
    return techLinks;
}
