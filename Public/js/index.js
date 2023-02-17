document.addEventListener("DOMContentLoaded", function() { //Waits for HTML DOM content to load
    const dmButton = document.getElementById("darkmodeButton"); //Gets darkMode button id
    

    if (dmButton) { //Checks whether or not button was clicked for debug purposes
	dmButton.addEventListener("click", function() {
	    console.log("Button was clicked!");
	});
    } else {
	console.error("Element with id 'darkMode' not found");
    }

    dmButton.addEventListener("click", dmSwitch);
    dmButton.addEventListener("click", toggleDmButton);
});

//for dark mode
var light = true;
function dmSwitch() {
    var background = document.body;
    var boxes = document.querySelectorAll(".grayBox");
    background.classList.toggle("dark-mode");
    boxes.forEach(function(box) {
	box.classList.toggle("dm-grayBox");
    });
    if (light == true) {
	document.documentElement.classList.remove("light")  
	document.documentElement.classList.add("dark");
	light = false;
    } else if (light == false) {
	document.documentElement.classList.add("light")  
	document.documentElement.classList.remove("dark")
	light = true;
    }
    }

function toggleDmButton() {
    let dmButton = document.getElementById("darkmode");
    if (dmButton.getAttribute("src") === "./images/sun.png") {
        dmButton.setAttribute("src", "./images/moon.png");
    } else {
	dmButton.setAttribute("src", "./images/sun.png");
    }
}

function darkMode() {
    var dmButton = document.createElement("button");
    dmButton.id = "darkMode";
    dmButton.innerHTML = "Toggle Dark Mode";
    document.body.appendChild(dmButton);
    document.getElementById("darkmode").src="./images/moon.png";
}

//darkMode();

window.onload = function () {
    let selectedCourses = localStorage.getItem("courses")
    if (selectedCourses != null) {
	selectedCourses = selectedCourses.split(',')
    }
    var classes = document.getElementById("class")
    
    for (let i = 0; i < selectedCourses.length; i++) {
	var newTr = document.createElement("tr")
	var newTh = document.createElement("th")
	newTh.appendChild(document.createTextNode(selectedCourses[i]))
	newTr.appendChild(newTh)
	classes.appendChild(newTr)
    }
}
