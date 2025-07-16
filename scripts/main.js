import { Navbar } from "./shared/navbar.js";
import { Taskbar } from "./shared/footer.js";
import * as events from "./shared/global-events.js";
import { CardDragBehavior, MaximizedCardComponent, MinimizeCardBehavior, PROJECT_LIST, ProjectCardComponent } from "./projects/index.js";
import { stopPropagationDecorator } from "./shared/decorators.js";


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

    if (card.stackListOverflow())
        card.setAutoStackScroll();
});

// SET PROJECT CARD BEHAVIORS
projectList.forEach((card) => {
    const dragBehavior = new CardDragBehavior(card, projectListNode);
    dragBehavior.setup();
    const minimizeBehavior = new MinimizeCardBehavior(card, Taskbar.instance().taskbar.querySelector(".taskbar__tray"));
    minimizeBehavior.setup();

    // MAXIMIZE/RESTORE
    card.windowButtonsNode.children[1].addEventListener("click", stopPropagationDecorator((_) => {
        // FROM 'normal card' TO 'maximized card'
        const cardParent = card.parent;
        const MaxCard = new MaximizedCardComponent(card);
        MaxCard.render(document.body);
        const MaxMinimizeBehavior = new MinimizeCardBehavior(MaxCard, Taskbar.instance().taskbar.querySelector(".taskbar__tray"));
        MaxMinimizeBehavior.setup();
        MaxCard.windowButtonsNode.children[0].addEventListener("click", stopPropagationDecorator((_) => {
            card.remove();
        }), {once: true});
        MaxCard.windowButtonsNode.children[1].addEventListener("click", stopPropagationDecorator((_) => {
            // FROM 'maximized card' TO 'normal card'
            MaxCard.destroy();
            card.render(cardParent);
        }), {once: true});
        MaxCard.windowButtonsNode.children[2].addEventListener("click", stopPropagationDecorator((_) => {
            card.destroy();
            MaxCard.destroy();
        }), {once: true});
    }));

    // CLOSE
    card.windowButtonsNode.children[2].addEventListener("click", stopPropagationDecorator((_) => {
        card.destroy();
    }))
});
