class Vect2D
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
}

export class PageMouseButtonEvent
{
    static EVENTS = ["pointerdown", "pointerup", "pointermove"];
    constructor()
    {
        this._subscribers = [];

        window.addEventListener("pointerdown", (e) => {
            const pos = new Vect2D(e.pageX, e.pageY);
            this._notifySubscribers("pointerdown", pos);
        });
        window.addEventListener("pointermove", (e) => {
            const pos = new Vect2D(e.pageX, e.pageY);
            const mov = new Vect2D(e.movementX, e.movementY);
            this._notifySubscribers("pointermove", pos, mov);
        });
        window.addEventListener("pointerup", (e) => {
            const pos = new Vect2D(e.pageX, e.pageY);
            this._notifySubscribers("pointerup", pos);
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
            if (eventType == "pointerdown" && sub && typeof sub.onPointerDown === 'function')
                sub.onPointerDown(pos);
            else if (eventType == "pointermove" && sub && typeof sub.onPointerMove === 'function')
                sub.onPointerMove(pos, movement);
            else if (eventType == "pointerup" && sub && typeof sub.onPointerUp === 'function')
                sub.onPointerUp(pos);
        })
    }
}

export class PageScrollEvent
{
    constructor()
    {
        this._lastScrollX = window.scrollX;
        this._lastScrollY = window.scrollY;
        this._subscribers = [];

        window.addEventListener("scroll", () => {
            const currentScrollX = window.scrollX;
            const currentScrollY = window.scrollY;
            const dirX = (currentScrollX > this._lastScrollX);
            const dirY = (currentScrollY > this._lastScrollY);
            let offsetX = Math.abs(currentScrollX - this._lastScrollX);
            let offsetY = Math.abs(currentScrollY - this._lastScrollY);
            
            this._lastScrollX = currentScrollX;
            this._lastScrollY = currentScrollY;
    
            if (!dirX)
                offsetX = -offsetX;
            if (!dirY)
                offsetY = -offsetY;

            this._notifySubscribers(offsetX, offsetY);
        });
    }

    _notifySubscribers(offsetX, offsetY)
    {
        for (const subscriber of this._subscribers)
        {
             if (subscriber && typeof subscriber.onScrollX === 'function')
                subscriber.onScrollX(offsetX);
             if (subscriber && typeof subscriber.onScrollY === 'function')
                subscriber.onScrollY(offsetY);
        }
    }

    subscribe(sub)
    {
        this._subscribers.push(sub);
    }
}
