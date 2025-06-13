import { PROJECT_LIST, ProjectCardComponent } from "./projects.js"
import { GlobalMouseEventNotifier } from "./global_events.js";
import { GlobalElementRect } from "./utils.js";

const projectListNode = document.querySelector(".project-list");
const pageMouseEvent = GlobalMouseEventNotifier.instance();

class CardDrag
{
    static instances = [];
    
    constructor(projectCard)
    {
        CardDrag.instances.push(this);
        this._projectsListRect = this._getGlobalBoundingClientRect(projectCard.parentNode);

        this._card = projectCard;
        this._cardFrame = this._card.querySelector(".project-list__card-frame");
        
        this._cardFrameSelected = false;
        this._cardRect = this._getGlobalBoundingClientRect(this._card);
        this._cardFrameRect = this._getGlobalBoundingClientRect(this._cardFrame);

        this._dragOffset = {x: 0, y: 0};
        this._originalSize = {width: this._cardRect.width, height: this._cardRect.height};

        this._isSetUp = false;
        this._callbacks = [];
    }

    destroy()
    {
        pageMouseEvent.unsubscribe(this);

        if (this._cardFrame && this._callbacks)
        {
            for (const { type, handler } of this._callbacks)
                this._cardFrame.removeEventListener(type, handler);
        }

        this._callbacks = null;
        this._onMouseDown = null;
        if (this._card)
        {
            this._card.remove();
            this._card = null;
            this._cardFrame = null;
        }

        const i = CardDrag.instances.indexOf(this);
        if (i !== -1)
            CardDrag.instances.splice(i, 1);
    }

    setup()
    {
        if (this._isSetUp)
            return;
        this._isSetUp = true;

        // STORE CALLBACKS FOR CLEANUP
        const downPrevent = this._preventDefault(true);
        this._cardFrame.addEventListener("mousedown", downPrevent);
        this._callbacks.push({ type: "mousedown", handler: downPrevent });

        const defaultPrevent = this._preventDefault();
        this._cardFrame.addEventListener("mouseup", defaultPrevent);
        this._cardFrame.addEventListener("mousemove", defaultPrevent);
        this._callbacks.push(
            { type: "mouseup", handler: defaultPrevent },
            { type: "mousemove", handler: defaultPrevent }
        );

        this._onMouseDown = this._onMouseDown.bind(this);
        this._cardFrame.addEventListener("mousedown", this._onMouseDown);
        this._callbacks.push({ type: "mousedown", handler: this._onMouseDown });
    }

    // UPDATE POSITION WHEN CARD IS LIFTED FROM CARD LIST
    _notifyLayoutChanges(sender)
    {
        CardDrag.instances.forEach((card) => {
            if (sender !== card)
                card._onLayoutChange();
        });
        if (!sender._card.classList.contains("moving"))
            sender._onLayoutChange();
    }
    _onLayoutChange()
    {
        this._cardRect = this._getGlobalBoundingClientRect(this._card)
        this._cardFrameRect = this._getGlobalBoundingClientRect(this._cardFrame);
    }

    // CALLBACKS
    _onMouseDown(event)
    {
        this._cardFrameSelected = true;

        // SET OFFSET BASED ON MOUSE CLICK POSITION RELATIVE TO THE CARD WINDOW.
        this._dragOffset.x = event.pageX - this._cardFrameRect.left;
        this._dragOffset.y = event.pageY - this._cardFrameRect.top;
    }

    // GLOBAL MOUSE MOVEMENT OBSERVER
    onMouseMove(pos, _)
    {
        if (!this._cardFrameSelected)
            return;
        if (!this._card.classList.contains("moving"))
        {
            // STORE ORIGNAL WIDTH/HEIGHT TO AVOID ELEMENT GROWING.
            this._card.style.width = `${this._originalSize.width}px`;
            this._card.style.height = `${this._originalSize.height}px`;
            this._card.classList.add("moving");
            this._notifyLayoutChanges(this);
        }

        // DRAG WINDOW RELATIVE TO THE MOUSE POINTER
        this._card.style.left = `${pos.x - this._dragOffset.x}px`;
        this._card.style.top = `${pos.y - this._dragOffset.y}px`;
    }
    onMouseUp(pos)
    {
        if (!this._cardFrameSelected)
            return;
        this._cardFrameSelected = false;

        const dropOnProjectList = this._isPointInsideRect(pos.x, pos.y, this._projectsListRect);
        if (dropOnProjectList && this._card.classList.contains("moving"))
        {
            this._card.classList.remove("moving");
            this._card.width = '';
            this._card.height = '';
            this._card.left = '';
            this._card.right = '';
            this._notifyLayoutChanges(this);
            return;
        }
        this._cardRect = this._getGlobalBoundingClientRect(this._card);
        this._cardFrameRect = this._getGlobalBoundingClientRect(this._cardFrame);
        this._card.style.left = `${this._cardRect.left}px`;
        this._card.style.top = `${this._cardRect.top}px`;
    }

    // HELPERS
    _getGlobalBoundingClientRect(element)
    {
        const rect = element.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        return {
            left: rect.left + scrollLeft,
            top: rect.top + scrollTop,
            right: rect.right + scrollLeft,
            bottom: rect.bottom + scrollTop,
            width: rect.width,
            height: rect.height,
            x: rect.left + scrollLeft,
            y: rect.top + scrollTop
        };
    }
    _isPointInsideRect(x, y, rect)
    {
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        );
    }
    _preventDefault(stopPropagation = false)
    {
        return (e) =>
        {
            e.preventDefault();
            if (stopPropagation)
                e.stopPropagation();
        }
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
            const behavior = setupCardDrag(card.node);
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
function setupCardDrag(card)
{
    const dragEvent = new CardDrag(card);
    dragEvent.setup();
    pageMouseEvent.subscribe(dragEvent);
    return dragEvent;
}
