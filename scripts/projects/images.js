let techIcons = null;
const techList = {
    javascript: "../images/projects/tech-stack-icons/javascript.svg",
    html5: "../images/projects/tech-stack-icons/html5.svg",
    css3: "../images/projects/tech-stack-icons/css3.svg",
    django: "../images/projects/tech-stack-icons/django.svg",
    djangorestframework: "../images/projects/tech-stack-icons/django-rest.svg",
    python: "../images/projects/tech-stack-icons/python.svg",
    docker: "../images/projects/tech-stack-icons/docker.svg",
};
  
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
