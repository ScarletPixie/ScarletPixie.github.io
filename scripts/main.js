import { Navbar } from "./navbar.js"
import { Taskbar } from "./footer.js"

// class HashChangeEvent
// {
//     constructor()
//     {
//         this._subscribers = [];

//         window.addEventListener("hashchange", () => {
//             let position = {x: 0, y: 0};
//             position.x = window.scrollX;
//             position.y = window.scrollY;
//             this._notifySubscribers(location.hash, position);
//         })
//     }

//     _notifySubscribers(newHash, newPos)
//     {
//         for (const subscriber of this._subscribers)
//         {
//              if (subscriber && typeof subscriber.onHashChange === 'function')
//                 subscriber.onHashChange(newHash, newPos);
//         }
//     }

//     subscribe(sub)
//     {
//         this._subscribers.push(sub);
//     }
// }

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
// const hashEvent = new HashChangeEvent();

const navbar = new Navbar();
navbar.setup();

scrollEvent.subscribe(navbar);
// hashEvent.subscribe(navbar);

const taskbar = new Taskbar();
taskbar.setup();

scrollEvent.subscribe(taskbar);
// hashEvent.subscribe(taskbar);
