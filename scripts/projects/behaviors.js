import
{
    GlobalMouseEventNotifier,
    GlobalElementRect,
    GlobalFocusChangeNotifier,
    Vector2D,
    preventDefaultDecorator,
    stopPropagationDecorator,
} from "../shared/index.js";
import { MinimizedCardComponent } from "./components.js"


export class TrapTabBehavior
{
    #controller = null;
    #card = null;
    #selector = null;
    #elements = [];
    #lastFocus = null;

    constructor(card, selector = '')
    {
        this.#card = card;
        this.#controller = new AbortController();
        this.#selector = selector;
    }
    
    setup()
    {
        GlobalFocusChangeNotifier.instance().subscribe(this);
        this.#elements = Array.from(this.#card.node.querySelectorAll(this.#selector));
        const first = this.#elements[0];
        const last = this.#elements[this.#elements.length - 1];
        this.#lastFocus = document.activeElement;
        first.focus();
        this.#card.node.addEventListener("keydown", (e) => {
            if (e.key !== 'Tab')
                return;

            if (e.shiftKey && document.activeElement === first)
            {
                e.preventDefault();
                last.focus();
            }
            else if (!e.shiftKey && document.activeElement === last)
            {
                e.preventDefault();
                first.focus();
            }
        }, {signal: this.#controller.signal});
    }

    destroy()
    {
        GlobalFocusChangeNotifier.instance().unsubscribe(this);
        if (!this.#card)
            return;
        this.#controller.abort();
        this.#controller = null;
        this.#card = null;
        this.#selector = null;
        this.#lastFocus.focus();
        this.#lastFocus = null;
    }

    restoreFocus()
    {
        this.#lastFocus.focus();
    }

    onFocusChange(event)
    {
        if (!document.body.classList.contains("modal-active"))
            this.#lastFocus = event.target;
    }
}

export class MinimizeCardBehavior
{
    #controller = null;
    #TargetContainer = null;
    #ParentContainer = null
    #card = null
    #isSetUp = false;

    #minimizedCard = null;

    constructor(card, container)
    {
        this.#controller = new AbortController();
        this.#card = card;
        this.#TargetContainer = container;
        this.#ParentContainer = card.parent;
    }

    setup()
    {
        if (this.#isSetUp)
            return;
        this.#isSetUp = true;
        this.#card.subscribe(this);

        // MINIMIZE BUTTON
        this.#card.windowButtonsNode.children[0].addEventListener("click", preventDefaultDecorator((_) => {
            this.#card.remove();
            this.#minimizedCard = new MinimizedCardComponent(this.#card.rawData);
            this.#minimizedCard.render(this.#TargetContainer);

            // RESTORE
            this.#minimizedCard.node.addEventListener("click", () => {
                this.#minimizedCard.destroy();
                this.#card.render(this.#ParentContainer);
            }, {signal: this.#controller.signal})

            // CLOSE
            this.#minimizedCard.closeBtnNode.addEventListener("click", stopPropagationDecorator((_) => {
                this.#card.destroy();
                this.#minimizedCard.destroy();
            }), {signal: this.#controller.signal})

        }), {signal: this.#controller.signal});
    }

    destroy()
    {
        if (!this.#card)
            return;
        this.#controller.abort();
        this.#controller = null;
        this.#card = null;
    }
}

export class CardDragBehavior
{
    static #mouseEventNotifier = GlobalMouseEventNotifier.instance();

    #container = null;
    #containerRect = null;
    #card = null;
    #cardWindow = null;
    #windowSelected = false;
    #cardRect = null;
    #cardWindowRect = null;
    #isSetUp = false;
    #windowDragOffset = null;
    #originalSize = null;

    #controller = null;
    #onMouseDownCb = null;

    constructor(card, container)
    {
        this.#controller = new AbortController();

        this.#container = container;
        this.#card = card;
        this.#cardWindow = this.#card.windowNode;
        this.#containerRect = new GlobalElementRect(container);

        this.#cardRect = new GlobalElementRect(this.#card.node);
        this.#cardWindowRect = new GlobalElementRect(this.#cardWindow);
        this.#windowDragOffset = new Vector2D();
        this.#originalSize = new Vector2D(this.#cardRect.width, this.#cardRect.height);

        this.#onMouseDownCb = this.#onMouseDown.bind(this);
    }

    destroy()
    {
        if (!this.#card)
            return;

        CardDragBehavior.#mouseEventNotifier.unsubscribe(this);
        this.#controller.abort();
        this.#controller = null;
        this.#card = null;
        this.#cardWindow = null;
    }

    setup()
    {
        if (this.#isSetUp)
            return;

        this.#card.subscribe(this);
        CardDragBehavior.#mouseEventNotifier.subscribe(this);
        this.#cardWindow.addEventListener("mousedown", stopPropagationDecorator(
            preventDefaultDecorator(this.#onMouseDownCb)
        ), {signal: this.#controller.signal});

        this.#cardWindow.addEventListener("mouseup", preventDefaultDecorator((_) => {}), {signal: this.#controller.signal});
        this.#cardWindow.addEventListener("mousemove", preventDefaultDecorator((_) => {}), {signal: this.#controller.signal});
    }

    // GLOBAL MOUSE MOVEMENT OBSERVER
    onMouseMove(pos, _)
    {
        if (!this.#eventReady())
            return;

        if (!this.#card.node.classList.contains("moving"))
        {
            // STORE ORIGINAL WIDTH/HEIGHT TO AVOID ELEMENT GROWING.
            this.#card.node.style.width = `${this.#originalSize.x}px`;
            this.#card.node.style.height = `${this.#originalSize.y}px`;
            this.#card.node.classList.add("moving");
            this.#updateCardRect();
        }

        // DRAG WINDOW RELATIVE TO THE MOUSE POINTER
        const pageWidth = Math.max(
            document.documentElement.clientWidth,
            document.body.scrollWidth,
            document.documentElement.scrollWidth
        );

        const pageHeight = Math.max(
            document.documentElement.clientHeight,
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        const newPosX = pos.x - this.#windowDragOffset.x;
        const newPosY = pos.y - this.#windowDragOffset.y;
        const clampedX = Math.min(newPosX, pageWidth - this.#originalSize.x);
        const clampedY = Math.min(newPosY, pageHeight - this.#originalSize.y);
        this.#card.node.style.left = `${clampedX}px`;
        this.#card.node.style.top = `${clampedY}px`;
    }
    onMouseUp(pos)
    {
        if (!this.#eventReady())
            return;

        this.#windowSelected = false;
        this.#updateCardRect();
        const dropOnProjectList = this.#containerRect.containsPoint(pos);
        if (dropOnProjectList && this.#card.node.classList.contains("moving"))
        {
            this.#card.node.classList.remove("moving");
            this.#card.node.style.width = '';
            this.#card.node.style.height = '';
            this.#card.node.style.left = '';
            this.#card.node.style.right = '';
            return;
        }
        this.#updateCardCoords();
    }
    #updateCardRect()
    {
        this.#cardRect = new GlobalElementRect(this.#card.node);
        this.#cardWindowRect = new GlobalElementRect(this.#cardWindow);
    }
    #updateCardCoords()
    {
        this.#updateCardRect();
        if (!this.#card.node.classList.contains("moving"))
            return;
        this.#card.node.style.left = `${this.#cardRect.left}px`;
        this.#card.node.style.top = `${this.#cardRect.top}px`;
    }

    // CALLBACKS
    #onMouseDown(event)
    {
        if (event.button !== 0)
            return;

        this.#updateCardRect();
        this.#windowSelected = true;
        this.#windowDragOffset = new Vector2D(
            event.pageX - this.#cardWindowRect.left,
            event.pageY - this.#cardWindowRect.top
        );
    }

    // HELPERS
    #eventReady()
    {
        return this.#windowSelected === true && this.#card.thumbLoaded === true;
    }
}


export class KeyboardCardDragBehavior
{
    static #velocity = 20;
    static #delta = 1 / 60;
    #activeKeys = [false, false, false, false];
    #dir = new Vector2D();


    #container = null;
    #containerRect = null;
    #card = null;
    #cardWindow = null;
    #windowSelected = false;
    #cardRect = null;
    #cardWindowRect = null;
    #isSetUp = false;
    #windowDragOffset = null;
    #originalSize = null;

    #controller = null;
    #onKeydownCb = null;
    #onKeyupCb = null;
    #onKeyMoveCb = null;

    constructor(card, container)
    {
        this.#controller = new AbortController();

        this.#container = container;
        this.#card = card;
        this.#cardWindow = this.#card.windowNode;
        this.#containerRect = new GlobalElementRect(container);

        this.#cardRect = new GlobalElementRect(this.#card.node);
        this.#cardWindowRect = new GlobalElementRect(this.#cardWindow);
        this.#windowDragOffset = new Vector2D();
        this.#originalSize = new Vector2D(this.#cardRect.width, this.#cardRect.height);

        this.#onKeydownCb = this.#onKeydown.bind(this);
        this.#onKeyupCb = this.#onKeyup.bind(this);
        this.#onKeyMoveCb = this.#onKeyMove.bind(this);

    }

    destroy()
    {
        if (!this.#card)
            return;

        this.#controller.abort();
        this.#controller = null;
        this.#card = null;
        this.#cardWindow = null;
    }

    setup()
    {
        if (this.#isSetUp)
            return;

        console.log("setup");
        this.#card.subscribe(this);

        // initial window select via keyboard
        this.#cardWindow.addEventListener("keydown", this.#onKeydownCb, {signal: this.#controller.signal});
        this.#card.node.addEventListener("keydown", this.#onKeyMoveCb, {signal: this.#controller.signal});
        this.#card.node.addEventListener("keyup", this.#onKeyupCb, {signal: this.#controller.signal});

        this.#isSetUp = true;
    }

    
    #updateCardRect()
    {
        this.#cardRect = new GlobalElementRect(this.#card.node);
        this.#cardWindowRect = new GlobalElementRect(this.#cardWindow);
    }
    #updateCardCoords()
    {
        this.#updateCardRect();
        if (!this.#card.node.classList.contains("moving"))
            return;
        this.#card.node.style.left = `${this.#cardRect.left}px`;
        this.#card.node.style.top = `${this.#cardRect.top}px`;
    }

    // CALLBACKS
    #onKeyMove(event)
    {
        if (!this.#eventReady())
            return;
        event.stopPropagation();
        if (event.key === 'Tab')
        {
            this.#windowSelected = false;
            this.#cardWindow.focus();
            return;
        }
        event.preventDefault();

        if (event.key === 'ArrowLeft')
        {
            this.#dir.x -= 1;
            this.#activeKeys[0] = true;
        }
        if (event.key === 'ArrowRight')
        {
            this.#dir.x += 1;
            this.#activeKeys[1] = true;
        }
        if (event.key === 'ArrowUp')
        {
            this.#dir.y -= 1;
            this.#activeKeys[2] = true;
        }
        if (event.key === 'ArrowDown')
        {
            this.#dir.y += 1
            this.#activeKeys[3] = true;
        }
        this.#dir = this.#dir.normalized();

        if (this.#activeKeys.some(active => active === true) && !this.#card.node.classList.contains("moving"))
        {
            // STORE ORIGINAL WIDTH/HEIGHT TO AVOID ELEMENT GROWING.
            this.#card.node.style.width = `${this.#originalSize.x}px`;
            this.#card.node.style.height = `${this.#originalSize.y}px`;
            this.#card.node.classList.add("moving");
            this.#updateCardRect();
        }

        const pageWidth = Math.max(
            document.documentElement.clientWidth,
            document.body.scrollWidth,
            document.documentElement.scrollWidth
        );

        const pageHeight = Math.max(
            document.documentElement.clientHeight,
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );

        const newPosX = this.#cardRect.x + (this.#dir.x * KeyboardCardDragBehavior.#velocity);
        const newPosY = this.#cardRect.y + (this.#dir.y * KeyboardCardDragBehavior.#velocity);
        const clampedX = Math.min(newPosX, pageWidth - this.#originalSize.x);
        const clampedY = Math.min(newPosY, pageHeight - this.#originalSize.y);
        this.#card.node.style.left = `${clampedX}px`;
        this.#card.node.style.top = `${clampedY}px`;
        this.#dir = new Vector2D();
        this.#updateCardCoords();
    }
    #onKeyup(event)
    {
        if (!this.#eventReady())
            return;

        event.stopPropagation();
        event.preventDefault();
        if (event.key === 'ArrowLeft')
        {
            this.#activeKeys[0] = false;
        }
        if (event.key === 'ArrowRight')
        {
            this.#activeKeys[1] = false;
        }
        if (event.key === 'ArrowUp')
        {
            this.#activeKeys[2] = false;
        }
        if (event.key === 'ArrowDown')
        {
            this.#activeKeys[3] = false;
        }

        if (this.#activeKeys.every(active => active === false))
        {
            const dropOnProjectList = this.#containerRect.containsPoint(new Vector2D(this.#cardRect.x, this.#cardRect.y));
            if (dropOnProjectList && this.#card.node.classList.contains("moving"))
            {
                this.#card.node.classList.remove("moving");
                this.#card.node.style.width = '';
                this.#card.node.style.height = '';
                this.#card.node.style.left = '';
                this.#card.node.style.right = '';
            }
            return;
        }
        this.#updateCardCoords();
    }
    #onKeydown(event)
    {
        event.stopPropagation();
        if (event.key !== 'Enter' && event.key !== ' ')
            return;
        event.preventDefault();
        this.#updateCardRect();
        this.#windowSelected = true;
        this.#windowDragOffset = new Vector2D(
            event.pageX - this.#cardWindowRect.left,
            event.pageY - this.#cardWindowRect.top
        );
        this.#card.node.focus();
    }

    // HELPERS
    #eventReady()
    {
        return this.#windowSelected === true && this.#card.thumbLoaded === true;
    }
}