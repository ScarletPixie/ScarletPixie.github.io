const taskbar = document.querySelector(".taskbar");
const clock = document.querySelector(".taskbar__clock");
updateClock();

// UPDATE CLOCK EVERY MINUTE
setInterval(updateClock, 60 * 1000);


let tlastScroll = window.scrollY;
let tsensibility = 50;
window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll < tlastScroll && currentScroll < tsensibility)
    {
        taskbar.classList.add("hidden");
    }
    else
        taskbar.classList.remove("hidden");
    tlastScroll = currentScroll;
});


// CALLBACKS
function updateClock()
{
    const now = new Date();
  
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = now.getFullYear();
  
    clock.textContent = `${hours}:${minutes} ${day}/${month}/${year}`;
}
