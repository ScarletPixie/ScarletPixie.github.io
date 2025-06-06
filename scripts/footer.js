const taskbar = document.querySelector(".taskbar");
const clock = document.querySelector(".taskbar__clock");
updateClock();

// UPDATE EVERY MINUTE
setInterval(updateClock, 60 * 1000);

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
