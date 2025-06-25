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

    get node() { return this._node; }
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

    get node() { return this._node; }
    get thumbNode() { return this.#thumbNode; }
    get windowNode() { return this.#windowNode; }
    get imageNodes() { return this.#imageNodes; }
    get windowButtonsNode() { return this.#windowButtonsNode; }

    get rawData() { return this.#rawData; }
    get thumbLoaded() { return this.#thumbLoaded; }
}

export class MinimizedCardComponent extends Component
{
    static #TEMPLATE =  document.getElementById("minimized-card-template");

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

    get node() { return this._node; }
    get closeBtnNode() { return this.#closeBtnNode; }
    get thumbNode() { return this.#thumbNode; }
    get titleNode() { return this.#titleNode; }
}