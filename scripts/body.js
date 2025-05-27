const GRADIENTS = {
    // https://webgradients.com/
    //6: "linear-gradient(to bottom, #000046, #1cb5e0)",           // Sunrise

    5: "linear-gradient(to top, #f43b47 0%, #453a94 100%)",
    9: "linear-gradient(to bottom, #fa709a 0%, #fee140 100%)",
    12: "linear-gradient(to top, #f6d365 0%, #fda085 100%)",
    16: "linear-gradient(to top, #f83600 0%, #f9d423 100%)",
    18: "linear-gradient(to top, #874da2 0%, #c43a30 100%)",
    21: "linear-gradient(to top, #1e3c72 0%, #1e3c72 1%, #2a5298 100%)",
};

//console.log("LOADED");

function getGradientSequence()
{
    let index = 0;
    const gradientHours = Object.keys(GRADIENTS).map(Number);
    function getCurrentGradientV2()
    { 
        const hour = gradientHours[index];
        const closestHour = Math.max(...gradientHours.filter(h => h <= hour));
        index = (index + 1) % 7;
        return GRADIENTS[closestHour];
    }
    return getCurrentGradientV2;
}

function getCurrentGradient()
{
    const hour = new Date().getHours();
    const gradientHours = Object.keys(GRADIENTS).map(Number);
    const closestHour = Math.max(...gradientHours.filter(h => h <= hour));
    return GRADIENTS[closestHour];
}

//document.body.style.background = getCurrentGradient();
//document.body.style.transition = "background 1s ease-in-out";

const gradientSeq = getGradientSequence();

setInterval(() => {
    //document.body.style.background = gradientSeq();
    //document.body.style.background = getCurrentGradient();
}, 2000);