var courses = [];
var selectedSemester = "fall";
var unsavedSchedule = {fall: {}, spring: {}};
var isDragging = false;
var wasSame = true;

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


    let selectedCourses = localStorage.getItem("courses");
    if (selectedCourses != null) {
	selectedCourses = selectedCourses.split(",");
    }
    
    var classes = document.getElementById("classes");
    
    courses = await getCoursesFromServer();
    // courses = {};
    // courses.items = JSON.parse(`[ { "credits": 0.5, "code": "AS1241", "id": 2, "section": "T01", "size": 0, "semester": 1, "name": "Computer Science 2", "seatsTaken": 0, "location": "STEAM", "period":["1","2","3","4","5","6","7","8"] }, { "credits": 0.5, "code": "AS1241", "id": 3, "section": "T02", "size": 0, "semester": 2, "name": "Computer Science 2", "seatsTaken": 0, "location": "STEAM", "period": ["2"] }, { "credits": 0.5, "code": "TA2345", "id": 4, "section": "T04", "size": 0, "semester": 1, "name": "Computer Science 1", "seatsTaken": 0, "location": "STEAM", "period": ["3"] }, { "credits": 0.5, "code": "TA2345", "id": 5, "section": "T05", "size": 0, "semester": 2, "name": "Computer Science 1", "seatsTaken": 0, "location": "STEAM", "period": ["3"] }, { "credits": 0.5, "code": "TA3245", "id": 6, "section": "T07", "size": 0, "semester": 1, "name": "Physics", "seatsTaken": 0, "location": "AHS", "period": ["4"] }, { "credits": 0.5, "code": "TA3245", "id": 7, "section": "T08", "size": 0, "semester": 2, "name": "Physics", "seatsTaken": 0, "location": "AHS", "period": ["4"] }, { "credits": 0.5, "code": "TB2135", "id": 8, "section": "T09", "size": 0, "semester": 1, "name": "Calculus", "seatsTaken": 0, "location": "AHS", "period": ["5"] }, { "credits": 0.5, "code": "TB2135", "id": 9, "section": "T10", "size": 0, "semester": 2, "name": "Calculus", "seatsTaken": 0, "location": "AHS", "period": ["5"] }, { "credits": 0.5, "code": "TASDF", "id": 10, "section": "T11", "size": 0, "semester": 1, "name": "English", "seatsTaken": 0, "location": "AHS", "period": ["6"] }, { "credits": 0.5, "code": "TASDF", "id": 11, "section": "T12", "size": 0, "semester": 2, "name": "English", "seatsTaken": 0, "location": "AHS", "period": ["6"] } ]`)

    const unsavedScheduleStr = localStorage.getItem("unsavedSchedule");
    if (unsavedScheduleStr) {
	unsavedSchedule = JSON.parse(unsavedScheduleStr);

	const semester = unsavedSchedule[selectedSemester];
	Object.keys(semester).forEach(id => {
	    const ele = document.getElementById(id);
	    const course = courses.items.find(a => a.code == semester[id]);
	    if (!course || !ele) return;
	    
	    ele.dataset.classcode = course.code;
	    ele.classList.add("notEmpty");
	    ele.setAttribute("draggable", true);
	    ele.addEventListener("dragstart", dragPlaced);
	    ele.addEventListener("dragend", dragPlacedEnd);
	    
	    ele.firstElementChild.innerText = course.name;
	});
    }
    
    if (courses != null) {
	// for (let i = 0; i < selectedCourses.length; i++) {
	//     var newTr = document.createElement("tr");
	//     var newTh = document.createElement("th");
	//     newTh.appendChild(document.createTextNode(selectedCourses[i]));
	//     newTr.appendChild(newTh);
	//     classes.appendChild(newTr);
	// }

	for (let i = 0; i < courses?.items?.length; i++) {
	    const course = courses.items[i];

	    if (selectedCourses.includes(course.code)) {
		if (document.getElementById(course.code) == null) {
		    let classDiv = document.createElement("div");
		    classDiv.classList.add("selectedClass");
		    classDiv.setAttribute("draggable", true);
		    classDiv.setAttribute("id", course.code);
		    classDiv.addEventListener('dragstart', (event) => { drag(event) });
		    classDiv.addEventListener('dragend', (event) => { dragEnd(event) });
		    classDiv.addEventListener('mouseover', (event) => { hoverClassSelector(event) });
		    classDiv.addEventListener('mouseleave', (event) => { dragEnd(event) });

		    let textDiv = document.createElement("div");
		    textDiv.classList.add("classText");
		    classDiv.appendChild(textDiv);
		    
		    let classP = document.createElement("span")
		    classP.appendChild(document.createTextNode(course.name))
		    classP.classList.add('title')
		
		    textDiv.appendChild(classP)

		    classes.appendChild(classDiv)

		    let idP = document.createElement('span');
		    idP.appendChild(document.createTextNode(course.code));
		    idP.classList.add("id");
		    textDiv.appendChild(idP);
		    
		    
		    let periodDiv = document.createElement("div");
		    periodDiv.classList.add("periods");
		    classDiv.appendChild(periodDiv);

		    //create the location
		    let locationP = document.createElement("p");
		    locationP.id = `${course.location}`
		    locationP.classList.add("location")
		    locationP.appendChild(document.createTextNode(course.location));
		    periodDiv.appendChild(locationP);
		    
		    for (let i = 0; i < course.period.length; i++) {
			let periodP = document.createElement("p");
			periodP.classList.add("period");
			periodP.appendChild(document.createTextNode(i+1))
			
			periodDiv.appendChild(periodP);
		    }

		    let demandDiv = document.createElement("div");
		    demandDiv.classList.add("demand");
		    classDiv.appendChild(demandDiv);

		    for(let i = 0; i < 3; i++) {
			let demandImg = document.createElement("img");
			demandImg.src = "images/fire.png"
			demandImg.setAttribute("draggable", false);
			demandDiv.appendChild(demandImg);
		    }
		}

		
	    }
	}
    }
});
//all the bs for dragging and dropping goes here, wish me luck
//document.addEventListener("DOMContentLoaded", (event) => {

function saveCurrentSchedule() {
    const periods = [
	"P0-S1-A", "P1-S1-A", "P2-S1-A", "P3-S1-A", "P4-S1-A", "P5-S1-B", "P6-S1-B", "P7-S1-B", "P8-S1-A",
	"P0-S2-A", "P1-S2-A", "P2-S2-A", "P3-S2-A", "P4-S2-A", "P5-S2-B", "P6-S2-B", "P7-S2-B", "P8-S2-A"
    ]

    let schedule = {};

    for (let i = 0; i < periods.length; i++) {
	const periodEle = document.getElementById(periods[i]);
	const classID = periodEle.dataset.classcode;
	if(classID == null || classID == "null") continue;
	
	if (classID) {
	    schedule[periods[i]] = classID;
	}
    }
    
    unsavedSchedule[selectedSemester] = schedule;

    localStorage.setItem("unsavedSchedule", JSON.stringify(unsavedSchedule));
}

function allowDrop(ev) {
    if(ev.target.classList.contains("valid")) {
	ev.preventDefault();
    }
}

function dragEnd(ev) {
    const validPeriodElements = document.querySelectorAll(".valid");
    for (var i = 0; i < validPeriodElements.length; i++) {
	validPeriodElements[i].classList.remove("valid")
    }
    
    const invalidPeriodElements = document.querySelectorAll(".invalid");
    for (var i = 0; i < invalidPeriodElements.length; i++) {
	invalidPeriodElements[i].classList.remove("invalid")
    }

    isDragging = false;
}

// remove it
function dragPlacedEnd(ev) {
    if (wasSame) {
	wasSame = false;
	return;
    }
    
    const oldClass = ev.target.dataset.classcode;
    
    if (oldClass) {
	dragEnd(null);
	ev.target.dataset.classcode = null;
	ev.target.classList.remove("notEmpty");
	ev.target.setAttribute("draggable", false);
	ev.target.removeEventListener("dragstart", dragPlaced);
	ev.target.removeEventListener("dragend", dragPlacedEnd);
	ev.target.firstElementChild.innerText = "Empty";
    }

    const droppedClassElement = document.getElementById(oldClass);

    droppedClassElement.style.display = "inline-block"; //show class from list
    
    saveCurrentSchedule();

    isDragging = false;
}

function highlightValidPeriods(classCode) {
    const course = courses.items.find(a => a.code == classCode);
    if (!course) return console.log(`invalid course code: ${classCode}`)

    let allPeriods = [];
    document.querySelectorAll(".class").forEach(a => allPeriods.push(a.id));

    const periods = Array.isArray(course.period) ? course.period.map(a => parseInt(a)) : [course.period];
    const isAHS = course.location == "AHS";

    let validPeriodIDs = [];

    for (let i = 0; i < periods.length; i++) {
	const period = periods[i];
	const isA = period <= 4 || period == 8;
	const periodID = `P${period}-S${course.semester}-${isA ? "A" : "B"}`;
	const periodElement = document.getElementById(periodID);
	if (periodElement) {
	    periodElement.classList.add("valid");
	    validPeriodIDs.push(periodID);
	} else {
	    console.log(`INVALID ID: ${periodID}`);
	}
    }

    const invalidPeriods = allPeriods.filter(a => !validPeriodIDs.includes(a));
    for (let i = 0; i < invalidPeriods.length; i++) {
	const periodElement = document.getElementById(invalidPeriods[i]);
	periodElement.classList.add("invalid");
    }
}    


function drag(ev) {
    ev.dataTransfer.setData('text/plain', ev.target.id);
    highlightValidPeriods(ev.target.id);

    // console.log(ev.dataTransfer.getData("text/plain"))

    isDragging = true;
}

function dragPlaced(ev) {
    ev.dataTransfer.setData('text/plain', `${ev.target.dataset.classcode}`);
    ev.dataTransfer.setData('text/oldclass', `${ev.target.id}`);

    highlightValidPeriods(ev.target.dataset.classcode);
    
    // console.log(`${ev.target.dataset.classcode}`);
    // console.log(ev.dataTransfer.getData('text/plain'));

    isDragging = true;
}

function hoverClassSelector(ev) {
    if (isDragging) return;
    if (!ev.target.classList.contains("selectedClass")) {
	var ele = ev.target;
	while (ele.parentElement != null) {
	    if (!ele.parentElement.classList.contains("selectedClass")) {
		ele = ele.parentElement;
		continue;
	    }
	    highlightValidPeriods(ele.parentElement.id);
	    break;
	}
    } else {
	highlightValidPeriods(ev.target.id);
    }
}

function drop(ev, target) {
    console.log(ev);
    if (!ev.target.classList.contains("valid")) {
	ev.preventDefault();
	return;
    }
    
    const droppedClass = ev.dataTransfer.getData('text/plain');
    const droppedClassElement = document.getElementById(droppedClass);

    droppedClassElement.style.display = "none"; // hide class from list

    const course = courses.items.find(a => a.code == droppedClass);
    
    ev.preventDefault();

    const oldClass = ev.dataTransfer.getData('text/oldclass');
    console.log(ev.target.id, oldClass);
    if (oldClass == ev.target.id) {
	dragEnd(null);
	wasSame = true;
	setTimeout(() => {
	    wasSame = false;
	}, 100);
	return;
    }

    ev.target.dataset.classcode = droppedClass;
    ev.target.classList.add("notEmpty");
    ev.target.setAttribute("draggable", true);
    ev.target.addEventListener("dragstart", dragPlaced);
    ev.target.addEventListener("dragend", dragPlacedEnd);
    
    ev.target.firstElementChild.innerText = course.name;

    if (oldClass) {
	dragEnd(null);
	if (oldClass != ev.target.id) {
	    const oldClassElement = document.getElementById(oldClass);
	    oldClassElement.dataset.classcode = null;
	    oldClassElement.classList.remove("notEmpty");
	    oldClassElement.setAttribute("draggable", false);
	    oldClassElement.removeEventListener("dragstart", dragPlaced);
	    oldClassElement.removeEventListener("dragend", dragPlacedEnd);
	    oldClassElement.firstElementChild.innerText = "Empty";
	}
    }

    saveCurrentSchedule();

    isDragging = false;
}

//for dark mode

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
	if (getDm() == "false") {
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
	document.getElementById("darkmode").src = "./images/moon.png";
}

//darkMode();

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

window.onload = function () {
    
    
    //set dark mode
    dmSwitch();
};
