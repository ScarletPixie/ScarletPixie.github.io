export class Publisher
{
    #subscribers = null;

    constructor()
    {
        if (new.target === Publisher)
            throw new Error("Cannot instantiate abstract class Publisher directly.");
        this.#subscribers = [];
    }

    notifySubscribers(callback)
    {
        this.#subscribers.forEach((subRef) => {
            const sub = subRef.deref();
            if (sub)
                callback(sub);
            else
                this.#removeDeadSubscribers();
        });
    }

    subscribe(obj)
    {
        this.#subscribers.push(new WeakRef(obj));
    }

    unsubscribe(obj)
    {
        this.#subscribers = this.#subscribers.filter((subRef) => {
            return subRef.deref() !== obj;
        });
    }

    #removeDeadSubscribers()
    {
        this.#subscribers = this.#subscribers.filter((subRef) => {
            return subRef.deref() !== undefined;
        });
    }
}
