import { Publisher } from "./behaviors.js";
import { Vector2D } from "./utils.js";
import { throttleDecorator } from "./decorators.js";

export class GlobalFocusChangeNotifier extends Publisher
{
    static #instance = null;
    static instance()
    {
        if (!this.#instance)
            this.#instance = new GlobalFocusChangeNotifier();
        return this.#instance;
    }

    constructor()
    {
        if (GlobalFocusChangeNotifier.#instance)
            throw new Error("Use GlobalFocusChangeNotifier.instance() instead of new.");

        super();
        document.addEventListener('focusin', (e) => {
            this.notifySubscribers((sub) => {
                sub?.onFocusChange?.(e);
            });
        });
    }
}

export class GlobalMouseEventNotifier extends Publisher
{
    static #EVENTS = {MOUSEDOWN: "mousedown", MOUSEUP: "mouseup", MOUSEMOVE: "mousemove"};

    static #instance = null;
    static instance()
    {
        if (!this.#instance)
            this.#instance = new GlobalMouseEventNotifier();
        return this.#instance;
    }

    constructor()
    {
        if (GlobalMouseEventNotifier.#instance)
            throw new Error("Use GlobalMouseEventNotifier.instance() instead of new.");

        super();
        window.addEventListener(GlobalMouseEventNotifier.#EVENTS.MOUSEDOWN, (e) => {
            const pos = new Vector2D(e.pageX, e.pageY);
            this.notifySubscribers((sub) => {
                sub?.onMouseDown?.(pos);
            });
        });
        window.addEventListener(GlobalMouseEventNotifier.#EVENTS.MOUSEMOVE, throttleDecorator((e) => {


            const pos = new Vector2D(e.pageX, e.pageY);
            const mov = new Vector2D(e.movementX, e.movementY);
            this.notifySubscribers((sub) => {
                sub?.onMouseMove?.(pos, mov);
            })
        }, 25));
        window.addEventListener(GlobalMouseEventNotifier.#EVENTS.MOUSEUP, (e) => {
            const pos = new Vector2D(e.pageX, e.pageY);
            this.notifySubscribers((sub) => {
                sub?.onMouseUp?.(pos);
            })
        });
    }
}
export class GlobalScrollEventNotifier extends Publisher
{
    static #instance = null;
    static instance()
    {
        if (!this.#instance)
            this.#instance = new GlobalScrollEventNotifier();
        return this.#instance;
    }
    constructor()
    {
        if (GlobalScrollEventNotifier.#instance)
            throw new Error("Use GlobalScrollEventNotifier.instance() instead of new.");

        super();
        this._lastScrollPos = new Vector2D(window.scrollX, window.scrollY);
        window.addEventListener("scroll", throttleDecorator(() => {
            const currentScrollPos = new Vector2D(window.scrollX, window.scrollY);
            const scrollMovement = currentScrollPos.sub(this._lastScrollPos);
            this.notifySubscribers((subscriber) => {
                subscriber.onScrollX?.(currentScrollPos, scrollMovement.x);
                subscriber.onScrollY?.(currentScrollPos, scrollMovement.y);
            });
            this._lastScrollPos = currentScrollPos;
        }, 100));
    }
}
