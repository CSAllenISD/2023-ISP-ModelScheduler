var AHS0Per = "8:35-9:35"
var AHS1Per = "8:50-9:45"
var AHS2Per = "9:50-11:25"
var AHS3Per = "11:30-1:30"
var AHS4Per = "1:35-3:10"
var AHS5Per = "9:50-11:25"
var AHS6Per = "11:30-1:30"
var AHS7Per = "1:35-3:10"
var AHS8Per = "3:15-4:10"
var STEAM0Per = "7:20-8:15"
var STEAM1Per = "8:20-9:15"
var STEAM2Per = "9:25-11:00"
var STEAM3Per = "11:45-1:15"
var STEAM4Per = "1:55-3:30" 
var STEAM5Per = "9:25-11:00" 
var STEAM6Per = "11:45-1:15"
var STEAM7Per = "1:55-3:30"
var STEAM8Per = "3:35-4:30"

async function updateClassSchedule() {
    document.querySelectorAll(".class").forEach((it) => (it.innerHTML = "Empty"));

    const courses = await getCoursesFromServer();

    const unsavedScheduleStr = localStorage.getItem("unsavedSchedule");
    if (unsavedScheduleStr) {
	unsavedSchedule = JSON.parse(unsavedScheduleStr);
	
	const semester = unsavedSchedule["fall"];
	Object.keys(semester).forEach(id => {
	    const ele = document.getElementById(id);
	    ele.innerHTML = ""
	    const course = courses.items.find(a => a.code == semester[id]);
	    if (!course || !ele) return;
	    
	    ele.dataset.classcode = course.code;
	    ele.classList.add("notEmpty");
	    ele.setAttribute("draggable", false);
	    ele.setAttribute("style", "cursor:default;")

	    //create info
	    let titleSpan = document.createElement('span');
	    titleSpan.innerHTML = course.name
	    ele.appendChild(titleSpan);

	    //create time span
	    let timeSpan = document.createElement("span");
	    timeSpan.classList.add("time");
	    ele.appendChild(timeSpan);

	    //create location
	    let locationSpan = document.createElement("span");
	    locationSpan.classList.add("location");
	    locationSpan.classList.add(course.location);
	    timeSpan.appendChild(locationSpan);
	    
	    courseLocation = course.location
	    coursePeriod = ele.id.charAt(1)
	    varName = `${courseLocation}${coursePeriod}Per`;
	    locationSpan.innerHTML = `${courseLocation} • ${window[varName]}`
	});
    }
}


//dark mode and light mode feature
document.addEventListener("DOMContentLoaded", async function () {
	//Waits for HTML DOM content to load
    const dmButton = document.getElementById("darkmodeButton"); //Gets darkMode button id
    
    if (dmButton) {
	//Checks whether or not button was clicked for debug purposes
	dmButton.addEventListener("click", function () {
	    console.log("Button was clicked!");
	});
    } else {
	console.error("Element with id 'darkMode' not found");
    }
    
    dmButton.addEventListener("click", toggleDm);

    /*let instructions = localStorage.getItem("finalInstructions")
    if (instructions == null){
	localStorage.setItem("finalInstructions", "true")
    }else {
	document.getElementById('modal').style.display = "none"
    }**/


    updateClassSchedule();    
});

window.onload = function () {
	dmSwitch();
};

function dmSwitch() {
	//    var background = document.body;
	//  var boxes = document.querySelectorAll(".grayBox");
	//   background.classList.toggle("dark-mode");
	//  boxes.forEach(function(box) {
	//	box.classList.toggle("dm-grayBox");
	//  });
	if (getDm() == "true") {
		document.documentElement.classList.remove("light");
		document.documentElement.classList.add("dark");
	} else if (getDm() == "false") {
		document.documentElement.classList.add("light");
		document.documentElement.classList.remove("dark");
	}

	toggleDmButton();
}

function toggleDm() {
	if (
		localStorage.getItem("darkmode") == null ||
		localStorage.getItem("darkmode") == "false"
	) {
		localStorage.setItem("darkmode", "true");
	} else {
		localStorage.setItem("darkmode", "false");
	}

	dmSwitch();
}

function getDm() {
	if (localStorage.getItem("darkmode") == null) {
		return "false";
	} else {
		return localStorage.getItem("darkmode");
	}
}

function toggleDmButton() {
    let dmButton = document.getElementById("darkmode");
    let printButton = document.getElementById("printButton");
    if (getDm() == "false") {
	dmButton.setAttribute("src", "./images/moon.png");
	printButton.setAttribute("src", "./images/print-light.png")
    } else {
	dmButton.setAttribute("src", "./images/sun.png");
	printButton.setAttribute("src", "./images/print-dark.png")
    }
}

function darkMode() {
	var dmButton = document.createElement("button");
	dmButton.id = "darkMode";
	dmButton.innerHTML = "Toggle Dark Mode";
	document.body.appendChild(dmButton);
	document.getElementById("darkmode").src = "./images/moon.png";
}

async function getCoursesFromServer() {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "./classes/data");
		xhr.send();
		xhr.responseType = "json";
		xhr.onload = () => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				const data = xhr.response;
				console.log(data);
				resolve(data);
			} else {
				console.log(`Error: ${xhr.status}`);
				reject(xhr.status);
			}
		};
	});
}
