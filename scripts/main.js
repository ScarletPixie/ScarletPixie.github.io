import { Navbar } from "./navbar.js";
import { Taskbar } from "./footer.js";
import * as events from "./shared/global-events.js";
import { CardDragBehavior, PROJECT_LIST, ProjectCardComponent } from "./projects/index.js";


// PAGE COMPONENTS SETUP
const navbar = new Navbar();
const taskbar = new Taskbar();
navbar.setup();
taskbar.setup();


// EVENTS SETUP
const scrollNotifier = events.GlobalScrollEventNotifier.instance();
scrollNotifier.subscribe(navbar);
scrollNotifier.subscribe(taskbar);


// CREATE PROJECT CARDS
const projectList = [];
const projectListNode = document.querySelector(".project-list");
PROJECT_LIST.forEach(projectData => {
    const card = new ProjectCardComponent(projectData);
    projectList.push(card);
    card.render(projectListNode);
});

// SET PROJECT CARD BEHAVIORS
projectList.forEach((card) => {
    const dragBehavior = new CardDragBehavior(card, projectListNode);
    dragBehavior.setup();

    //MINIMIZE
    card.windowButtonsNode.children[0].addEventListener("click", (e) => {
        e.stopPropagation();
    });
    // MAXIMIZE/RESTORE
    card.windowButtonsNode.children[1].addEventListener("click", (e) => {
        e.stopPropagation();
    });
    // CLOSE
    card.windowButtonsNode.children[2].addEventListener("click", (e) => {
        e.stopPropagation();
        card.destroy();
    })
});
