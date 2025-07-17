import { Publisher } from "./behaviors.js";


export class Component extends Publisher
{
    _node = null;
    _parent = null;

    constructor(element)
    {
        super();
        this._node = element;
        if (this._node.parentNode !== null)
            this._parent = this._node.parentNode;
    }

    render(container = null)
    {
        const parent = container || this._parent;
        if (parent === null)
            return null;

        parent.appendChild(this._node);
        this._parent = parent;
        return parent;
    }
    remove()
    {
        this._node.remove()
        this._parent = null;
    }
    destroy()
    {
        this.remove();
        this.notifySubscribers((sub) => {
            if (sub && typeof sub.destroy === 'function')
                sub.destroy();
        })
        this._node = null;
    }

    get node() { return this._node; }
}
