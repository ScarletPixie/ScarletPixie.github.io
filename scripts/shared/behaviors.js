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
