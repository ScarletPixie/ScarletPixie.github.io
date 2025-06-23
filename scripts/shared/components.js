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
