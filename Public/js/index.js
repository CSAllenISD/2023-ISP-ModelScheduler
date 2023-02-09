document.addEventListener("DOMContentLoaded", function() { //Waits for HTML DOM content to load
    const button = document.getElementById("darkMode");

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

darkMode();
