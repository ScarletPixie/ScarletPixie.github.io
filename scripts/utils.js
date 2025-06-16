export class Vector2D
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
    add(rhs)
    {
        return new Vector2D(this.x + rhs.x, this.y + rhs.y);
    }
    sub(rhs)
    {
        return new Vector2D(this.x - rhs.x, this.y - rhs.y);
    }
}

export class GlobalElementRect
{
    #rect = {
        x: 0, y: 0,
        left: 0, right: 0, top: 0, bottom: 0,
        width: 0, heigh: 0,
    }
    #element = null
    constructor(element)
    {
        this.#element = element;
        this.#rect = this.#getGlobalBoundingClientRect(element);
    }
    update()
    {
        this.#rect = this.#getGlobalBoundingClientRect(this.#element);
    }
    containsPoint(pos)
    {
        return (
            pos.x >= this.#rect.left &&
            pos.x <= this.#rect.right &&
            pos.y >= this.#rect.top &&
            pos.y <= this.#rect.bottom
        );
    }
    #getGlobalBoundingClientRect(element)
    {
        const rect = element.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        return {
            left: rect.left + scrollLeft,
            top: rect.top + scrollTop,
            right: rect.right + scrollLeft,
            bottom: rect.bottom + scrollTop,
            width: rect.width,
            height: rect.height,
            x: rect.left + scrollLeft,
            y: rect.top + scrollTop
        };
    }
    get x() { return this.#rect.x; };
    get y() { return this.#rect.y; };

    get width() { return this.#rect.width; };
    get height() { return this.#rect.height; };

    get left() { return this.#rect.left; };
    get right() { return this.#rect.right; };
    get top() { return this.#rect.top; };
    get bottom() { return this.#rect.bottom; };
}

export class Publisher
{
    constructor()
    {
        if (new.target === Publisher)
            throw new Error("Cannot instantiate abstract class Publisher directly.");
        this._subscribers = [];
    }

    notifySubscribers(callback)
    {
        this._subscribers.forEach((subRef) => {
            const sub = subRef.deref();
            if (sub)
                callback(sub);
            else
                this._removeDeadSubscribers();
        });
    }

    subscribe(obj)
    {
        this._subscribers.push(new WeakRef(obj));
    }

    unsubscribe(obj)
    {
        this._subscribers = this._subscribers.filter((subRef) => {
            return subRef.deref() !== obj;
        });
    }

    _removeDeadSubscribers()
    {
        this._subscribers = this._subscribers.filter((subRef) => {
            return subRef.deref() !== undefined;
        });
    }
}


export class Component
{
    _node = null;
    _parent = null;

    constructor(element)
    {
        this._node = element;
        if (this._node.parentNode !== null)
            this._parent = this._node.parentNode;
    }

    render(container = null)
    {
        const parent = container || this._parent;
        if (parent === null)
            return;

        parent.appendChild(this._node);
        this._parent = parent;
    }
    remove()
    {
        this._node.remove()
        this._parent = null;
    }
    destroy()
    {
        this.remove();
        this._node = null;
    }
}


// DECORATORS
export function stopPropagationDecorator(fn)
{
    return function(...args)
    {
        const [event] = args;
        if (event && typeof event.stopPropagation === 'function')
            event.stopPropagation();
        return fn.apply(this, args);
    }
}
export function preventDefaultDecorator(fn)
{
    return function(...args)
    {
        const [event] = args;
        if (event && typeof event.preventDefault === 'function')
            event.preventDefault();
        return fn.apply(this, args);
    }
}

export function logDecorator(fn, message = "")
{
    return function(...args)
    {
        console.log(message);
        return fn.apply(this, args);
    }
}
export function throttleDecorator(fn, throttleDelayMs = 100)
{
    let throttling = false;
    return function(...args)
    {
        if (throttling)
            return;
        throttling = true;
        setTimeout(() => { throttling = false; }, throttleDelayMs);
        return fn.apply(this, args);
    }
}
export function helloWorldDecorator(fn)
{
    return function(...args)
    {
        console.log("Hello, World!");
        return fn.apply(this, args);
    }
}