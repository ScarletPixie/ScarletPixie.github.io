import { Component } from "../shared/index.js";
import { getTechIcons } from "./images.js";

export class CardStackComponent extends Component
{
    static #ICON_REPO = getTechIcons();
    static #TEMPLATE = document.getElementById("project-card-template").content.querySelector("#card-tech-stack-item");

    #techName = null;
    constructor(techName, url = '#')
    {
        const clone = CardStackComponent.#TEMPLATE.content.firstElementChild.cloneNode(true);
        super(clone);

        this.#techName = techName;

        this._node.querySelector(".project-list__card-tech-stack-link").href = url;
        this._node.querySelector(".project-list__card-tech-stack-link-text").textContent = techName;
        this._node.querySelector(".project-list__card-tech-stack-icon").src = CardStackComponent.#ICON_REPO.get(techName)?.src ?? "";
    }

    get techName() { return this.#techName; }
}

export class ProjectCardComponent extends Component
{
    static #TEMPLATE = document.getElementById("project-card-template");

    #rawData = null;
    #windowNode = null;
    #windowButtonsNode = null;
    #imageNodes = null;
    #thumbNode = null
    #stackListNode = null;
    #stackListSectionNode = null;
    #stack = null;

    #thumbLoaded = false;

    constructor(rawData)
    {
        const clone = ProjectCardComponent.#TEMPLATE.content.firstElementChild.cloneNode(true);
        super(clone);

        this.#rawData = rawData;
        this.#stack = []

        this._node.querySelector(".project-list__card-title").textContent = rawData.title;
        this.#thumbNode = this._node.querySelector(".project-list__card-thumb");
        this.#thumbNode.src = rawData.preview.thumbnail;
        this.#thumbNode.alt = rawData.preview.alt;
        this._node.querySelector(".project-list__card-text").textContent = rawData.preview.summary;
        this.#stackListNode = this._node.querySelector(".project-list__card-tech-stack");
        this.#stackListSectionNode = this._node.querySelector(".project-list__card-tech-section");

        this.#windowNode = this._node.querySelector(".project-list__card-frame");
        this.#windowButtonsNode = this._node.querySelector(".project-list__card-actions");
        this.#imageNodes = this._node.querySelectorAll("img");

        [...new Set(rawData.preview.stack)].forEach(techName => {
            const cardStack = new CardStackComponent(techName);
            this.#stack.push(cardStack);
            cardStack.render(this.#stackListNode);
        });

        if (this.#thumbNode.complete)
            this.#thumbLoaded = true;
        else
        {
            this.#thumbNode.addEventListener('load', () => { this.#thumbLoaded = true; }, {once: true});
            this.#thumbNode.addEventListener('error', () => { this.#thumbLoaded = true; }, {once: true});
        }
    }

    stackListOverflow()
    {
        return this.#stackListNode.clientWidth > this.#stackListSectionNode.clientWidth;
    }
    setAutoStackScroll()
    {
        [...new Set(this.#rawData.preview.stack)].forEach(techName => {
            const cardStack = new CardStackComponent(techName);
            this.#stack.push(cardStack);
            cardStack.render(this.#stackListNode);
        });
        this.#stackListNode.classList.add("auto-scroll");
    }

    get parent() { return this._parent; }
    get thumbNode() { return this.#thumbNode; }
    get windowNode() { return this.#windowNode; }
    get imageNodes() { return this.#imageNodes; }
    get windowButtonsNode() { return this.#windowButtonsNode; }

    get rawData() { return this.#rawData; }
    get thumbLoaded() { return this.#thumbLoaded; }
}

export class MaximizedCardComponent extends Component
{
    static #TEMPLATE = document.getElementById("maximized-project-card-template");
    #windowButtonsNode = null;
    #card = null;
    #rawData = null;
    #thumbNode = null;
    #titleNode = null;
    #descriptionNode = null;

    #stackListNode = null;
    #stack = [];

    constructor(originCard)
    {
        const clone = MaximizedCardComponent.#TEMPLATE.content.firstElementChild.cloneNode(true);
        super(clone);

        this.#windowButtonsNode = this._node.querySelector(".project-list__card-actions");
        this.#card = originCard;
        this.#rawData = this.#card.rawData;

        this.#thumbNode = this._node.querySelector(".project-list__card-thumb--maximized");
        this.#thumbNode.src = this.#rawData.preview.thumbnail;

        this.#titleNode = this._node.querySelector(".project-list__card-title");
        this.#titleNode.textContent = this.#rawData.title;

        this.#descriptionNode = this._node.querySelector(".project-list__card-text--maximized");
        this.#descriptionNode.textContent = this.#rawData.description;

        this.#stackListNode = this._node.querySelector(".project-list__card-tech-stack");

        [...new Set(this.#rawData.preview.stack)].forEach(techName => {
            const cardStack = new CardStackComponent(techName);
            this.#stack.push(cardStack);
            cardStack.render(this.#stackListNode);
        });
    }

    get parent() { return this._parent; }
    get windowButtonsNode() { return this.#windowButtonsNode; }
    get rawData() { return this.#rawData; }

    // METHOD OVERRIDING
    render(container = null)
    {
        const parent = super.render(container);

        if (parent !== null)
            document.body.classList.add("modal-active");
        return parent;
    }
    remove()
    {
        super.remove();
        document.body.classList.remove("modal-active");
    }
}

export class MinimizedCardComponent extends Component
{
    static #TEMPLATE = document.getElementById("minimized-card-template");

    #closeBtnNode = null;
    #thumbNode = null;
    #titleNode = null;

    constructor(cardData)
    {
        const clone = MinimizedCardComponent.#TEMPLATE.content.firstElementChild.cloneNode(true);

        super(clone);
        this.#closeBtnNode = this._node.querySelector(".taskbar__tray-item-btn");
        this.#thumbNode = this._node.querySelector(".taskbar__tray-item-icon");
        this.#titleNode = this._node.querySelector(".taskbar__tray-item-text");

        this.#thumbNode.src = cardData.preview.thumbnail;
        this.#titleNode.textContent = cardData.title;
    }

    get parent() { return this._parent; }
    get closeBtnNode() { return this.#closeBtnNode; }
    get thumbNode() { return this.#thumbNode; }
    get titleNode() { return this.#titleNode; }
}
