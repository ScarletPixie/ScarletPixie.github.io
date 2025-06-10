import { PROJECT_LIST } from "./projects.js"


// PROJECT CARDS
const template = document.getElementById("project-card-template");
const projectList = document.querySelector(".project-list");

PROJECT_LIST.forEach(project => {
    console.log(project);
    const clone = template.content.cloneNode(true);
    clone.querySelector(".project-list__card-title").textContent = project.title;
    clone.querySelector(".project-list__card-thumb").src = project.preview.thumbnail;
    clone.querySelector(".project-list__card-thumb").alt = project.preview.alt;
    clone.querySelector(".project-list__card-text").textContent = project.preview.summary;
    projectList.appendChild(clone);
});


// PROJECT CARD BEHAVIORS
const projectCards = projectList.querySelectorAll(".project-list__card");
projectCards.forEach((card) => {
    card.querySelector(".project-list__card-actions").lastElementChild.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.add("project-list__card--closing");
        card.addEventListener("transitionend", () => {
            card.remove();
        }, {once: true});
    });
});
