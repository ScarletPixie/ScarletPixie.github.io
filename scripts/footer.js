export class Taskbar
{
    constructor()
    {
        this.taskbar = document.querySelector(".taskbar");
        this.clock = document.querySelector(".taskbar__clock");
        this._taskbarScrollSensibility = -5;
       
        this._updateClock = this._updateClock.bind(this);
    }

    setup()
    {
        this._updateClock();
        this.setUpdateClock();
    }

    setUpdateClock()
    {
        // UPDATE CLOCK EVERY MINUTE
        setInterval(this._updateClock, 60 * 1000);
    }

    onScrollY(_, movement)
    {
        const PAGE_HEIGHT = document.documentElement.scrollHeight;
        const VIEWPORT_Y = window.innerHeight;

        // SHOW NEAR/AT BOTTOM
        if ((VIEWPORT_Y + window.scrollY) > (PAGE_HEIGHT - this.taskbar.offsetHeight))
            this.taskbar.classList.remove("hidden");
        else if (movement < this._taskbarScrollSensibility)
            this.taskbar.classList.add("hidden");
        else if (movement > -(this._taskbarScrollSensibility * 0.5))
            this.taskbar.classList.remove("hidden");        
    }

    // CALLBACKS
    _updateClock()
    {
        const now = new Date();
      
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        const year = now.getFullYear();
      
        this.clock.textContent = `${hours}:${minutes} ${day}/${month}/${year}`;
    }
}
