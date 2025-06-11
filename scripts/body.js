import { PROJECT_LIST } from "./projects.js"
import { PageMouseButtonEvent } from "./global_events.js";



class WindowFrameDrag
{
    static instances = [];
    
    constructor(projectCard)
    {
        this._projectsList = projectCard.parentNode;
        this._card = projectCard;
        this._cardFrame = this._card.querySelector(".project-list__card-frame");

        this._originalPos = this._getGlobalBoundingClientRect(this._card);
        this._currentPos = this._originalPos;

        this._currentWindowFramePos = this._getGlobalBoundingClientRect(this._cardFrame);
        this._originalWindowPos = this._currentWindowFramePos;

        this._windowSelected = false;
        this._originalPosStyle = this._card.style.position;
        this._originalSize = {width: this._originalPos.width, height: this._originalPos.height};

        WindowFrameDrag.instances.push(this);

        this._onMouseDown = this._onMouseDown.bind(this);
        this._cardFrame.addEventListener("mousedown", this._onMouseDown);
        this._dragOffset = {x: 0, y: 0};
    }

    setup()
    {
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

    _notifyLayoutChanges(sender)
    {
        WindowFrameDrag.instances.forEach((card) => {
            if (card !== sender)
                card._onLayoutChange();
        });
    }
    _onLayoutChange()
    {
        this._originalPos = this._getGlobalBoundingClientRect(this._card);
        this._currentPos = this._originalPos;
        this._currentWindowFramePos = this._getGlobalBoundingClientRect(this._cardFrame);
        this._originalWindowPos = this._currentWindowFramePos;
    }

    _onMouseDown(event)
    {
        this._windowSelected = true;
        this._card.style.width = `${this._originalSize.width}px`;
        this._card.style.height = `${this._originalSize.height}px`;

        const offsetX = event.pageX - this._currentWindowFramePos.left
        const offsetY = event.pageY - this._currentWindowFramePos.top
        this._dragOffset.x = offsetX;
        this._dragOffset.y = offsetY;
    }
    onMouseMove(pos, mov)
    {
        if (!this._windowSelected)
            return;
        if (!this._card.style.position || this._card.style.position !== 'absolute')
            this._notifyLayoutChanges(this);

        // DRAG WINDOW RELATIVE TO THE MOUSE POINTER


        this._card.style.transition = 'none';
        this._card.style.position = 'absolute';
        this._card.style.left = `${pos.x - this._dragOffset.x}px`;
        this._card.style.top = `${pos.y - this._dragOffset.y}px`;
    }
    onMouseUp(pos)
    {
        if (!this._windowSelected)
            return;
        this._notifyLayoutChanges(this);
        this._windowSelected = false;
        //this._card.style.transform = '';
        this._card.style.transition = '';
        this._currentPos = this._getGlobalBoundingClientRect(this._card);
        this._currentWindowFramePos = this._getGlobalBoundingClientRect(this._cardFrame);
        this._card.style.left = `${this._currentPos.left}px`;
        this._card.style.top = `${this._currentPos.top}px`;
        //this._card.style.position = this._originalPosStyle;
        //this._card.style.willChange = 'auto';
    }

    _clamp(targetPos)
    {
        if (targetPos.x < 0)
            targetPos.x = 0;
        else if (targetPos.x >= (document.documentElement.scrollWidth - this._currentPos.width))
            targetPos.x = document.documentElement.scrollWidth - this._currentPos.width;
    
        if (targetPos.y < 0)
            targetPos.y = 0;
        else if (targetPos.y >= (document.documentElement.scrollHeight - this._currentPos.height))
            targetPos.y = document.documentElement.scrollHeight - this._currentPos.height;
        return targetPos;
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
