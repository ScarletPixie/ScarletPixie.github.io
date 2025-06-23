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
