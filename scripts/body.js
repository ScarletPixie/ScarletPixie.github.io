import { PROJECT_LIST } from "./projects.js"
import { PageMouseButtonEvent } from "./global_events.js";



class WindowFrameDrag
{
    static order = 0;

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

        this._id = WindowFrameDrag.order++;
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

    onMouseDown(pos)
    {
        const hasClickedOnCardFrame = this._isPointInsideRect(pos.x, pos.y, this._currentWindowFramePos);
        console.log(`${pos} - clicked: ${hasClickedOnCardFrame}`);
        if (!hasClickedOnCardFrame)
        {
            console.log(`element: ${this._id}`, pos, this._currentWindowFramePos);
            return;
        }
        this._windowSelected = true;
    }
    onMouseMove(pos, mov)
    {
        if (!this._windowSelected)
            return;

        if (!this._card.style.transform || this._card.style.transform === "")
        {
            // CENTER WINDOW WITH MOUSE POINTER
            this._card.style.transition = 'none';
            this._card.style.position = 'absolute';
            this._card.style.willChange = "transform";
            this._card.style.width = `${this._originalSize.width}px`;
            this._card.style.height = `${this._originalSize.height}px`;
            this._card.style.left = `${pos.x - (this._currentWindowFramePos.width / 2)}px`;
            this._card.style.top = `${pos.y - (this._currentWindowFramePos.height / 2)}px`;
            return;
        }
    }
    onMouseUp(pos)
    {
        if (!this._windowSelected)
            return;
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
    _updatePos()
    {
        this._currentPos = this._card.getBoundingClientRect();
        this._currentWindowFramePos = this._cardFrame.getBoundingClientRect();
    }

    _isPointInsideRect(posX, posY, rect)
    {
        return (posX >= rect.left && posX <= rect.right && posY >= rect.top && posY <= rect.bottom);
    }
    _getGlobalBoundingClientRect(element)
    {
        const rect = element.getBoundingClientRect();
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        return {
            left: rect.left + scrollLeft,
            top: rect.top + scrollTop,
            right: rect.right + scrollLeft,
            bottom: rect.bottom + scrollTop,
            width: rect.width,
            height: rect.height,
            x: rect.x + scrollLeft,
            y: rect.y + scrollTop
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
