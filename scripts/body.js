import { PROJECT_LIST, ProjectCardComponent } from "./projects/index.js";
import { CardDragBehavior } from "./projects/index.js";

const projectListNode = document.querySelector(".project-list");

// CREATE PROJECT CARDS
const projectList = [];
PROJECT_LIST.forEach(projectData => {
    const card = new ProjectCardComponent(projectData);
    projectList.push(card);
    card.render(projectListNode);
});

// SET PROJECT CARD BEHAVIORS
const activeCardDraggingBehaviors = [];
projectList.forEach((card) => {
    //MINIMIZE
    card.windowButtonsNode.children[0].addEventListener("click", (e) => {
        e.stopPropagation();
    });
    // MAXIMIZE/RESTORE
    card.windowButtonsNode.children[1].addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // ONLY SETUP DRAGGING/CLOSING WHEN THE THUMBNAIL INSIDE THE CARDS HAVE LOADED/FAILED TO LOAD
    const callback = cardDragPreSetup(1, card);
    card.thumbNode.addEventListener("load", callback);
    card.thumbNode.addEventListener("error", callback);
});

function cardDragPreSetup(imageCount, card)
{
    let loaded = 0;
    return () => {
        loaded++;
        if (loaded >= imageCount)
        {
            const behavior = setupCardDrag(card, projectListNode);
            activeCardDraggingBehaviors.push(behavior);
            card.windowButtonsNode.children[2].addEventListener("click", (e) => {
                e.stopPropagation();
                card.node.classList.add("project-list__card--closing");
                card.node.addEventListener("transitionend", () => {
                    const index = activeCardDraggingBehaviors.indexOf(behavior);
                    if (index !== -1)
                        activeCardDraggingBehaviors.splice(index, 1);
                    behavior.destroy();
                }, {once: true,});
            });
        }
    };
}
function setupCardDrag(card, parent)
{
    const dragEvent = new CardDragBehavior(card, parent);
    dragEvent.setup();
    return dragEvent;
}
