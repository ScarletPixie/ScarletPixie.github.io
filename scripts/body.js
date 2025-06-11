import { PROJECT_LIST } from "./projects.js"
import { PageMouseButtonEvent } from "./global_events.js";



class WindowFrameDrag
{
    static instances = [];
    
    constructor(projectCard)
    {
        WindowFrameDrag.instances.push(this);
        this._projectsListRect = this._getGlobalBoundingClientRect(projectCard.parentNode);

        this._card = projectCard;
        this._cardFrame = this._card.querySelector(".project-list__card-frame");
        
        this._cardFrameSelected = false;
        this._cardRect = this._getGlobalBoundingClientRect(this._card);
        this._cardFrameRect = this._getGlobalBoundingClientRect(this._cardFrame);

        this._dragOffset = {x: 0, y: 0};
        this._originalSize = {width: this._cardRect.width, height: this._cardRect.height};
    }

    setup()
    {
        this._onMouseDown = this._onMouseDown.bind(this);
        this._cardFrame.addEventListener("mousedown", this._onMouseDown);

        this._cardFrame.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
        })
        this._cardFrame.addEventListener("mouseup", (e) => {
            e.preventDefault();
            e.stopPropagation();
        })
        this._cardFrame.addEventListener("mousemove", (e) => {
            e.preventDefault();
            e.stopPropagation();
        })
    }

    // UPDATE POSITION WHEN CARD IS LIFTED FROM CARD LIST
    _notifyLayoutChanges(_)
    {
        WindowFrameDrag.instances.forEach((card) => {
            card._onLayoutChange();
        });
    }
    _onLayoutChange()
    {
        this._cardRect = this._getGlobalBoundingClientRect(this._card)
        this._cardFrameRect = this._getGlobalBoundingClientRect(this._cardFrame);
    }

    _onMouseDown(event)
    {
        
        this._cardFrameSelected = true;

        // SET OFFSET BASED ON MOUSE CLICK POSITION RELATIVE TO THE CARD WINDOW.
        this._dragOffset.x = event.pageX - this._cardFrameRect.left;
        this._dragOffset.y = event.pageY - this._cardFrameRect.top;
    }
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
    _isPointInsideRect(x, y, rect) {
    return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
    );
}
}


// PROJECT CARDS
const template = document.getElementById("project-card-template");
const projectList = document.querySelector(".project-list");

PROJECT_LIST.forEach(project => {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".project-list__card-title").textContent = project.title;
    clone.querySelector(".project-list__card-thumb").src = project.preview.thumbnail;
    clone.querySelector(".project-list__card-thumb").alt = project.preview.alt;
    clone.querySelector(".project-list__card-text").textContent = project.preview.summary;
    projectList.appendChild(clone);
});


const pageMouseEvent = new PageMouseButtonEvent();

// PROJECT CARD BEHAVIORS
const projectCards = projectList.querySelectorAll(".project-list__card");
projectCards.forEach((card) => {
    const images = card.querySelectorAll('img');
    const cardButtons = card.querySelector(".project-list__card-actions");

    //MINIMIZE
    cardButtons.children[0].addEventListener("click", (e) => {
        e.stopPropagation();
    });
    // MAXIMIZE/RESTORE
    cardButtons.children[1].addEventListener("click", (e) => {
        e.stopPropagation();
    });
    // CLOSE
    cardButtons.children[2].addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.add("project-list__card--closing");
        card.addEventListener("transitionend", () => {
            card.remove();
        }, {once: true,});
    });

    // ONLY SETUP DRAGGING WHEN ALL THE IMAGES INSIDE THE CARDS HAVE LOADED/FAILED TO LOAD
    let loadedCardImages = 0;
    images.forEach((img) => {
        img.addEventListener("load", () => {
            loadedCardImages++;
            if (loadedCardImages >= images.length)
            {
                const dragEvent = new WindowFrameDrag(card);
                dragEvent.setup();
                pageMouseEvent.subscribe(dragEvent);
            }
        });
        img.addEventListener("error", () => {
            loadedCardImages++;
            if (loadedCardImages >= images.length)
            {
                const dragEvent = new WindowFrameDrag(card);
                dragEvent.setup();
                pageMouseEvent.subscribe(dragEvent);
            }
        });
    });
});
