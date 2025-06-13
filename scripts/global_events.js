import { Publisher, Vector2D } from "./utils.js";

export class GlobalMouseEventNotifier extends Publisher
{
    static #EVENTS = {MOUSEDOWN: "mousedown", MOUSEUP: "mouseup", MOUSEMOVE: "mousemove"};

    static #throttling = false;
    static #THROTTLE_TIME_MS = 25;

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
            })
        });
        window.addEventListener(GlobalMouseEventNotifier.#EVENTS.MOUSEMOVE, (e) => {
            if (GlobalMouseEventNotifier.#throttling)
                return;
            GlobalMouseEventNotifier.#throttling = true;
            setTimeout(() => {
                GlobalMouseEventNotifier.#throttling = false;
            }, GlobalMouseEventNotifier.#THROTTLE_TIME_MS);

            const pos = new Vector2D(e.pageX, e.pageY);
            const mov = new Vector2D(e.movementX, e.movementY);
            this.notifySubscribers((sub) => {
                sub?.onMouseMove?.(pos, mov);
            })
        });
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
    static _throttling = false;
    static _THROTTLE_TIME_MS = 100;

    static _instance = null;
    static instance()
    {
        if (!this._instance)
            this._instance = new GlobalScrollEventNotifier();
        return this._instance;
    }
    constructor()
    {
        if (GlobalScrollEventNotifier._instance)
            throw new Error("Use GlobalScrollEventNotifier.instance() instead of new.");

        super();
        this._lastScrollPos = new Vector2D(window.scrollX, window.scrollY);
        window.addEventListener("scroll", () => {
            if (GlobalScrollEventNotifier._throttling)
                return;
            GlobalScrollEventNotifier._throttling = true;
            setTimeout(() => {
                GlobalScrollEventNotifier._throttling = false;
            }, GlobalScrollEventNotifier._THROTTLE_TIME_MS);

            const currentScrollPos = new Vector2D(window.scrollX, window.scrollY);
            const scrollMovement = currentScrollPos.sub(this._lastScrollPos);
            this.notifySubscribers((subscriber) => {
                subscriber.onScrollX?.(currentScrollPos, scrollMovement.x);
                subscriber.onScrollY?.(currentScrollPos, scrollMovement.y);
            });
            this._lastScrollPos = currentScrollPos;
        });
    }
}