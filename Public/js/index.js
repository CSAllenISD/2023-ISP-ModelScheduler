document.addEventListener("DOMContentLoaded", function() { //Waits for HTML DOM content to load
    const button = document.getElementById("darkmodeButton");

    if (button) { //Checks whether or not button was clicked for debug purposes
	button.addEventListener("click", function() {
	    console.log("Button was clicked!");
	});
    } else {
	console.error("Element with id 'darkMode' not found");
    }

    button.addEventListener("click", dmSwitch);
});

function dmSwitch() {
    var background = document.body;
    var boxes = document.querySelectorAll(".grayBox");
    background.classList.toggle("dark-mode");
    boxes.forEach(function(box) {
	box.classList.toggle("dm-grayBox");
    });
}

function darkMode() {
    var dmButton = document.createElement("button");
    dmButton.id = "darkMode";
    dmButton.innerHTML = "Toggle Dark Mode";
    document.body.appendChild(dmButton);
}

//darkMode();

window.onload = function () {
    let selectedCourses = localStorage.getItem("courses")
    if (selectedCourses != null) {
	selectedCourses = selectedCourses.split(',')
    }
    var classes = document.getElementById("classes")
    
    for (let i = 0; i < selectedCourses.length; i++) {
	var newTr = document.createElement("tr")
	var newTh = document.createElement("th")
	newTh.appendChild(document.createTextNode(selectedCourses[i]))
	newTr.appendChild(newTh)
	classes.appendChild(newTr)
    }
}
