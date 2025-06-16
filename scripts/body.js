import { PROJECT_LIST, ProjectCardComponent } from "./projects.js"
import { GlobalMouseEventNotifier } from "./global-events.js";
import {
    GlobalElementRect,
    Vector2D,
    preventDefaultDecorator,
    stopPropagationDecorator,
} from "./utils.js";

const projectListNode = document.querySelector(".project-list");
const pageMouseEvent = GlobalMouseEventNotifier.instance();

class CardDragBehavior
{
    static #instances = new Map();
    static #mouseEventNotifier = GlobalMouseEventNotifier.instance();
    
    #container = null;
    #containerRect = null;
    #card = null;
    #cardWindow = null;
    #windowSelected = false;
    #cardRect = null;
    #cardWindowRect = null;
    #isSetUp = false;
    #windowDragOffset = null;
    #originalSize = null;

    #controller = null;
    #onMouseDownCb = null;

    constructor(card, container)
    {
        const instanceList = CardDragBehavior.#instances.get(container) || [];
        instanceList.push(this);
        this.#controller = new AbortController();

        this.#container = container;
        this.#card = card;
        this.#cardWindow = this.#card.windowNode;
        this.#containerRect = new GlobalElementRect(container);

        this.#cardRect = new GlobalElementRect(this.#card.node);
        this.#cardWindowRect = new GlobalElementRect(this.#cardWindow);
        this.#windowDragOffset = new Vector2D();
        this.#originalSize = new Vector2D(this.#cardRect.width, this.#cardRect.height);

        this.#onMouseDownCb = this.#onMouseDown.bind(this);
    }

    destroy()
    {
        if (!this.#card)
            return;

        CardDragBehavior.#mouseEventNotifier.unsubscribe(this);
        this.#controller.abort();
        this.#controller = null;
        this.#card.destroy();
        this.#card = null;
        this.#cardWindow = null;

        const instanceList = CardDragBehavior.#instances.get(this.#container) || [];
        const i = instanceList.indexOf(this);
        if (i !== -1)
            instanceList.splice(i, 1);
    }

    setup()
    {
        if (this.#isSetUp)
            return;
        this.#cardWindow.addEventListener("mousedown", stopPropagationDecorator(
            preventDefaultDecorator(this.#onMouseDownCb)
        ), {signal: this.#controller.signal});

        this.#cardWindow.addEventListener("mouseup", preventDefaultDecorator((_) => {}), {signal: this.#controller.signal});
        this.#cardWindow.addEventListener("mousemove", preventDefaultDecorator((_) => {}), {signal: this.#controller.signal});
    }

    // UPDATE POSITION WHEN CARD IS LIFTED FROM CARD LIST
    #notifyLayoutChanges(sender)
    {
        const instanceList = CardDragBehavior.#instances.get(this.#container) || [];
        instanceList.forEach((card) => {
            if (sender !== card)
                card.#updateCardRect();
        });
        if (!sender.#card.node.classList.contains("moving"))
            sender.#updateCardRect();
    }

    // GLOBAL MOUSE MOVEMENT OBSERVER
    onMouseMove(pos, _)
    {
        if (!this.#windowSelected)
            return;

        if (!this.#card.node.classList.contains("moving"))
        {
            // STORE ORIGINAL WIDTH/HEIGHT TO AVOID ELEMENT GROWING.
            this.#card.node.style.width = `${this.#originalSize.x}px`;
            this.#card.node.style.height = `${this.#originalSize.y}px`;
            this.#card.node.classList.add("moving");
            this.#notifyLayoutChanges(this);
        }

        // DRAG WINDOW RELATIVE TO THE MOUSE POINTER
        this.#card.node.style.left = `${pos.x - this.#windowDragOffset.x}px`;
        this.#card.node.style.top = `${pos.y - this.#windowDragOffset.y}px`;
    }
    onMouseUp(pos)
    {
        if (!this.#windowSelected)
            return;
        this.#windowSelected = false;

        const dropOnProjectList = this.#containerRect.containsPoint(pos);
        if (dropOnProjectList && this.#card.node.classList.contains("moving"))
        {
            this.#card.node.classList.remove("moving");
            this.#card.node.style.width = '';
            this.#card.node.style.height = '';
            this.#card.node.style.left = '';
            this.#card.node.style.right = '';
            this.#notifyLayoutChanges(this);
            return;
        }
        this.#updateCardCoords();
    }
    #updateCardRect()
    {
        this.#cardRect = new GlobalElementRect(this.#card.node);
        this.#cardWindowRect = new GlobalElementRect(this.#cardWindow);
    }
    #updateCardCoords()
    {
        this.#updateCardRect();
        if (!this.#card.node.classList.contains("moving"))
            return;
        this.#card.node.style.left = `${this.#cardRect.left}px`;
        this.#card.node.style.top = `${this.#cardRect.top}px`;
    }

    // CALLBACKS
    #onMouseDown(event)
    {
        this.#windowSelected = true;
        this.#windowDragOffset = new Vector2D(
            event.pageX - this.#cardWindowRect.left,
            event.pageY - this.#cardWindowRect.top
        );
    }
}


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
    pageMouseEvent.subscribe(dragEvent);
    return dragEvent;
}
