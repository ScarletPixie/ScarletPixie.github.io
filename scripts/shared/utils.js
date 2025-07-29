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
    normalized()
    {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length === 0)
            return new Vector2D();
        return new Vector2D(this.x / length, this.y / length);
    }
}

export class GlobalElementRect
{
    #rect = {
        x: 0, y: 0,
        left: 0, right: 0, top: 0, bottom: 0,
        width: 0, height: 0,
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





