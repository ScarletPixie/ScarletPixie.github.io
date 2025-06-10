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
    static EVENTS = ["mousedown", "mouseup", "mousemove"];
    constructor()
    {
        this._subscribers = [];

        window.addEventListener("mousedown", (e) => {
            const pos = new Vect2D(e.pageX, e.pageY);
            this._notifySubscribers("mousedown", pos);
        }, {capture: true});
        window.addEventListener("mousemove", (e) => {
            const pos = new Vect2D(e.pageX, e.pageY);
            const mov = new Vect2D(e.movementX, e.movementY);
            this._notifySubscribers("mousemove", pos, mov);
        }, {capture: true});
        window.addEventListener("mouseup", (e) => {
            const pos = new Vect2D(e.pageX, e.pageY);
            this._notifySubscribers("mouseup", pos);
        }, {capture: true});
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
