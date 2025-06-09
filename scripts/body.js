import { PROJECT_LIST } from "./projects/projects.js"

const template = document.getElementById("project-card-template");
const container = document.querySelector(".project-list");

PROJECT_LIST.forEach(project => {
    console.log(project);
    const clone = template.content.cloneNode(true);
    clone.querySelector(".project-list__card-title").textContent = project.title;
    clone.querySelector(".project-list__card-thumb").src = project.preview.thumbnail;
    clone.querySelector(".project-list__card-thumb").alt = project.preview.alt;
    clone.querySelector(".project-list__card-text").textContent = project.preview.summary;
    container.appendChild(clone);
});
    
