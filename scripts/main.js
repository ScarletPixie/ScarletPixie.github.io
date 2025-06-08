import { Navbar } from "./navbar.js"
import { Taskbar } from "./footer.js"

class PageScrollEvent
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

const scrollEvent = new PageScrollEvent();
const navbar = new Navbar();
navbar.setup();

scrollEvent.subscribe(navbar);

const taskbar = new Taskbar();
taskbar.setup();
scrollEvent.subscribe(taskbar);
