import { Navbar } from "./navbar.js"
import { Taskbar } from "./footer.js"
import * as events from "./global_events.js";


// PAGE COMPONENTS SETUP
const navbar = new Navbar();
const taskbar = new Taskbar();
navbar.setup();
taskbar.setup();


// EVENTS SETUP
const scrollEvent = new events.PageScrollEvent();
scrollEvent.subscribe(navbar);
