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

export class Publisher {
    constructor() {
        if (new.target === Publisher) {
            throw new Error("Cannot instantiate abstract class Publisher directly.");
        }

        this._subscribers = [];
    }

    notifySubscribers(callback) {
        this._subscribers.forEach((subRef) => {
            const sub = subRef.deref();
            if (sub)
                callback(sub);
            else
                this._removeDeadSubscribers();
        });
    }

    subscribe(obj) {
        this._subscribers.push(new WeakRef(obj));
    }

    unsubscribe(obj) {
        this._subscribers = this._subscribers.filter((subRef) => {
            return subRef.deref() !== obj;
        });
    }

    _removeDeadSubscribers() {
        this._subscribers = this._subscribers.filter((subRef) => {
            return subRef.deref() !== undefined;
        });
    }
}
