import { Navbar } from "./shared/navbar.js";
import { Taskbar } from "./shared/footer.js";
import * as events from "./shared/global-events.js";
import { CardDragBehavior, MinimizeCardBehavior, PROJECT_LIST, ProjectCardComponent } from "./projects/index.js";


// PAGE COMPONENTS SETUP
const navbar = new Navbar();
const taskbar = Taskbar.instance();
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
    const minimizeBehavior = new MinimizeCardBehavior(card, Taskbar.instance().taskbar.querySelector(".taskbar__tray"));
    minimizeBehavior.setup();

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
