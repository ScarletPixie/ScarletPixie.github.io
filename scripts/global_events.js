import { Publisher, Vector2D } from "./utils.js";

export class PageMouseButtonEvent
{
    static EVENTS = ["mousedown", "mouseup", "mousemove"];
    constructor()
    {
        this._subscribers = [];

        window.addEventListener("mousedown", (e) => {
            const pos = new Vector2D(e.pageX, e.pageY);
            this._notifySubscribers("mousedown", pos);
        });
        window.addEventListener("mousemove", (e) => {
            const pos = new Vector2D(e.pageX, e.pageY);
            const mov = new Vector2D(e.movementX, e.movementY);
            this._notifySubscribers("mousemove", pos, mov);
        });
        window.addEventListener("mouseup", (e) => {
            const pos = new Vector2D(e.pageX, e.pageY);
            this._notifySubscribers("mouseup", pos);
        });
    }

    subscribe(subscriber)
    {
        this._subscribers.push(subscriber);
    }

    _notifySubscribers(eventType, pos, movement = null)
    {
        if (!PageMouseButtonEvent.EVENTS.includes(eventType))
            throw new Error(`PageMouseButtonEvent: '${eventType}' is not a valid event.`);

        this._subscribers.forEach((sub) => {
            if (eventType == "mousedown" && sub && typeof sub.onMouseDown === 'function')
                sub.onMouseDown(pos);
            else if (eventType == "mousemove" && sub && typeof sub.onMouseMove === 'function')
                sub.onMouseMove(pos, movement);
            else if (eventType == "mouseup" && sub && typeof sub.onMouseUp === 'function')
                sub.onMouseUp(pos);
        })
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