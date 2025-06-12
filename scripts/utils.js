export class Vect2D
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
    add(rhs)
    {
        return new Vect2D(this.x + rhs.x, this.y + rhs.y);
    }
    sub(rhs)
    {
        return new Vect2D(this.x - rhs.x, this.y - rhs.y);
    }
}

export class Publisher
{
    constructor()
    {
        this._subscribers = [];
    }
    notifySubscribers(callback)
    {
        this._subscribers.forEach((sub) => {
            callback(sub);
        });
    }
    subscribe(obj)
    {
        this._subscribers.push(new WeakRef(obj));
    }
    unsubscribe(obj)
    {
        this._subscribers = this._subscribers.filter((subRef) => {
            subRef.deref() !== obj;
        });
    }
    removeDeadSubscribers()
    {
        this._subscribers = this._subscribers.filter((subRef) => {
            subRef.deref() !== undefined;
        });
    }
}
