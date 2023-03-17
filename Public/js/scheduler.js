var courses = [];
var selectedSemester = "fall";
var unsavedSchedule = {fall: {}, spring: {}};
var isDragging = false;
var wasSame = true;

const perTimes = {
    AHS0Per: "8:35-9:35",
    AHS1Per: "8:50-9:45",
    AHS2Per: "9:50-11:25",
    AHS3Per: "11:30-1:30",
    AHS4Per: "1:35-3:10",
    AHS5Per: "9:50-11:25",
    AHS6Per: "11:30-1:30",
    AHS7Per: "1:35-3:10",
    AHS8Per: "3:15-4:10",
    STEAM0Per: "7:20-8:15",
    STEAM1Per: "8:20-9:15",
    STEAM2Per: "9:25-11:00",
    STEAM3Per: "11:45-1:15",
    STEAM4Per: "1:55-3:30",
    STEAM5Per: "9:25-11:00", 
    STEAM6Per: "11:45-1:15",
    STEAM7Per: "1:55-3:30",
    STEAM8Per: "3:35-4:30",
    CTC1Per: "7:55-8:45",
    CTC2Per: "9:25-10:15",
    CTC3Per: "11:55-12:45",
    CTC4Per: "2:00-2:50",
    CTC5Per: "9:25-10:40",
    CTC6Per: "11:55-1:10",
    CTC7Per: "2:00-3:15",
    CTC8Per: "3:40-4:55"
}

var conflicts = {
    "AHS0": ["STEAM1", "CTC1"],
    "AHS1": ["STEAM2", "STEAM5"],
    "AHS8": ["STEAM4", "STEAM7"],

    "STEAM1": ["AHS0"],
    "STEAM2": ["AHS1"],
    "STEAM4": ["AHS8"],
    "STEAM5": ["AHS1"],
    "STEAM7": ["AHS8"],

    "CTC1": ["AHS0"],
    "CTC2": ["AHS1", "AHS5", "STEAM5"],
    "CTC3": ["AHS6", "STEAM6"],
    "CTC4": ["AHS8", "AHS7", "STEAM7"],
    "CTC5": ["AHS1", "AHS2", "STEAM2"],
    "CTC6": ["AHS3", "STEAM3"],
    "CTC7": ["AHS8", "AHS4", "STEAM4"],
}

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

    let instructions = localStorage.getItem("schedulerInstructions")
    if (instructions == null){
	localStorage.setItem("schedulerInstructions", "true")
    }else {
	document.getElementById('modal').style.display = "none"
    }


    const classEles = document.querySelectorAll(".class");
    classEles.forEach(ele => {
	const demandContainer = document.createElement("div");
	demandContainer.classList.add("demandContainer");

	const demandLavaContainer = document.createElement("div");
	demandLavaContainer.classList.add("demandLavaContainer");
	demandContainer.appendChild(demandLavaContainer);

	const demandLavaWave1 = document.createElement("div");
	demandLavaWave1.classList.add("wave");
	demandLavaContainer.appendChild(demandLavaWave1);

	const demandLavaWave2 = document.createElement("div");
	demandLavaWave2.classList.add("wave");
	demandLavaContainer.appendChild(demandLavaWave2);

	ele.appendChild(demandContainer);
    });

    let selectedCourses = localStorage.getItem("courses");
    if (selectedCourses != null) {
	selectedCourses = selectedCourses.split(",");
    }
    
    var classes = document.getElementById("classes");
    
    courses = await getCoursesFromServer();
    courses = await combineCourses(courses);
    reloadCourseList(courses)
 
    const unsavedScheduleStr = localStorage.getItem("unsavedSchedule");
    if (unsavedScheduleStr) {
	unsavedSchedule = JSON.parse(unsavedScheduleStr);
	
	const semester = unsavedSchedule[selectedSemester];
	Object.keys(semester).forEach(async (id) => {
	    const ele = document.getElementById(id);
	    const course = courses.find(a => a.code == semester[id]);
	    if (!course || !ele) return;
	    
	    ele.dataset.classcode = course.code;
	    ele.classList.add("notEmpty");
	    ele.setAttribute("draggable", true);
	    ele.addEventListener("dragstart", dragPlaced);
	    ele.addEventListener("dragend", dragPlacedEnd);

	    //set location and time
	    ele.firstElementChild.innerText = course.name;
	    ele.children[1].innerHTML = `<span class="location ${course.location}">${course.location}</span> • ` + perTimes[`${course.location}${ele.id.charAt(1)}Per`];

	    const demand = await requestDemand(course.code, ele.id.charAt(1), ele.id.substring(3, 5));
	    const demandEle = ele.querySelector(".demandContainer");
	    if (demandEle) {
		demandEle.style.setProperty('--percent', demand.demand+"px");
	    }
	    
	    const classListItem = document.getElementById(course.code)
	    classListItem.style.display = "none";
	});
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

function reloadCourseList(courses) {
    const selectedCourses = localStorage.getItem("courses")
    
    if (courses != null) {
	for (let i = 0; i < courses.length; i++) {
	    const course = courses[i];
	    
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
		locationP.classList.add(`${course.location}`);
		locationP.classList.add("location")
		locationP.appendChild(document.createTextNode(course.location));
		periodDiv.appendChild(locationP);
		
		for (let i = 0; i < 9; i++) {
		    let period = course.period[i]
		    let periodP = document.createElement("p");
		    periodP.classList.add("period");

		    //logic for highlight
		    if (course.period.includes(i)) {
			periodP.classList.add("highlighted");
		    }
			
		    periodP.appendChild(document.createTextNode(i))
		    
		    periodDiv.appendChild(periodP);
		}
	    }
	    
		
	}
    }
    }
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
    
    const conflictedPeriodElements = document.querySelectorAll(".conflicted");
    for (var i = 0; i < conflictedPeriodElements.length; i++) {
	conflictedPeriodElements[i].classList.remove("conflicted")
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
	ev.target.children[1].innerText = "";

	if (ev.target.id.includes("S1")) {
	    let secondSemesterId = ev.target.id.replace("S1", "S2")
	    let secondSemester = document.getElementById(secondSemesterId)
	    secondSemester.dataset.classcode = null;
	    secondSemester.classList.remove("notEmpty");
	    secondSemester.setAttribute("draggable", false);
	    secondSemester.removeEventListener("dragstart", dragPlaced);
	    secondSemester.removeEventListener("dragend", dragPlacedEnd);
	    
	    secondSemester.firstElementChild.innerText = "Empty";
	    secondSemester.children[1].innerText = "";
	}else if (ev.target.id.includes("S2")) {
	    let firstSemesterId = ev.target.id.replace("S2", "S1")
	    let firstSemester = document.getElementById(firstSemesterId)
	    firstSemester.dataset.classcode = null;
	    firstSemester.classList.remove("notEmpty");
	    firstSemester.setAttribute("draggable", false);
	    firstSemester.removeEventListener("dragstart", dragPlaced);
	    firstSemester.removeEventListener("dragend", dragPlacedEnd);
	    
	    firstSemester.firstElementChild.innerText = "Empty";
	    firstSemester.children[1].innerText = "";
	}
	
	const droppedClassElement = document.getElementById(oldClass);
	droppedClassElement.style.display = "inline-block"; //show class from list
    }


    
    saveCurrentSchedule();

    isDragging = false;
}

function highlightValidPeriods(classCode) {
    const course = courses.find(a => a.code == classCode);
    if (!course) return console.log(`invalid course code: ${classCode}`)

    let allPeriods = [];
    document.querySelectorAll(".class").forEach(a => allPeriods.push(a.id));

    const periods = course.period;
    const isAHS = course.location == "AHS";

    let validPeriodIDs = [];
    let conflictedPeriodIDs = [];

    for (let i = 0; i < periods.length; i++) {
	var periodIDFall = null;
	var periodIDSpring = null;
	var periodElementFall = null;
	var periodElementSpring = null;
	const period = periods[i];
	const isA = period <= 4 || period == 8;
	if (course.term.includes("S1+S2")) {
	    periodIDFall = `P${period}-S1-${isA ? "A" : "B"}`;
	    periodElementFall = document.getElementById(periodIDFall);

	    periodIDSpring = `P${period}-S2-${isA ? "A" : "B"}`;
	    periodElementSpring = document.getElementById(periodIDSpring);
	} else if (course.term.includes("S1")) {
	    periodIDFall = `P${period}-S1-${isA ? "A" : "B"}`;
	    periodElementFall = document.getElementById(periodIDFall); 
	} else if (course.term.includes("S2")) {
	    periodIDSpring = `P${period}-S2-${isA ? "A" : "B"}`;
	    periodElementSpring = document.getElementById(periodIDSpring);
	} else { console.log("invalid semester"); return;}

	if (periodElementFall || periodElementSpring) {
	    const courseLoc = course.location+period;
	    const keys = Object.keys(conflicts);

	    function checkConflict(semester, periodElement, periodID, periodPreCond, preIsA, i) {		
		const prePeriodID = `P${periodPreCond}-S${semester}-${preIsA ? "A" : "B"}`;
		const prePeriodElement = document.getElementById(prePeriodID);
		
		if(prePeriodElement && prePeriodElement.children.length > 1) {
		    if(prePeriodElement.querySelector(".location")?.innerText.includes(keys[i].replace(periodPreCond, ""))) {
			periodElement.classList.add("conflicted");
			conflictedPeriodIDs.push(periodID);
		    }
		}
	    }
	    
	    Object.values(conflicts).forEach((badPeriods, i) => {
		badPeriods.forEach(badPeriod => {
		    if (badPeriod == courseLoc) {
			const periodPreCond = keys[i].replace("STEAM", "").replace("AHS", "").replace("CTC", "");
			const preIsA = periodPreCond <= 4 || periodPreCond == 8;
			if (periodElementFall) checkConflict(1, periodElementFall, periodIDFall, periodPreCond, preIsA, i);
			if (periodElementSpring) checkConflict(2, periodElementSpring, periodIDSpring, periodPreCond, preIsA, i);
		    }
		});
	    });

	    if(periodIDFall && !conflictedPeriodIDs.includes(periodIDFall)) {
		periodElementFall.classList.add("valid");
		validPeriodIDs.push(periodIDFall);
	    }
	    if(periodIDSpring && !conflictedPeriodIDs.includes(periodIDSpring)) {
		periodElementSpring.classList.add("valid");
		validPeriodIDs.push(periodIDSpring);
	    }
	} else {
	    console.log(`INVALID ID: ${periodID}`);
	}
    }

    const invalidPeriods = allPeriods.filter(a => !validPeriodIDs.includes(a) && !conflictedPeriodIDs.includes(a));
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

async function drop(ev, target) {
    console.log(ev);
    if (!ev.target.classList.contains("valid")) {
	ev.preventDefault();
	return;
    }

    const droppedClass = ev.dataTransfer.getData('text/plain');
    const droppedClassElement = document.getElementById(droppedClass);

    droppedClassElement.style.display = "none"; // hide class from list

    const classThere = ev.target.dataset.classcode; //gets the class already in the period
    if (classThere && classThere != droppedClass) {
	const oldEle = document.getElementById(classThere);
	if (oldEle != null) {
	    oldEle.style.display = "inline-block";
	}
    }

    const course = courses.find(a => a.code == droppedClass);
    
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

    if(course.term == "S1+S2") {
	if(ev.target.id.includes("S1")) {
	    let secondSemesterId = ev.target.id.replace("S1", "S2")
	    let secondSemester = document.getElementById(secondSemesterId)
	    secondSemester.dataset.classcode = droppedClass;
	    secondSemester.classList.add("notEmpty");
	    secondSemester.setAttribute("draggable", true);
	    secondSemester.addEventListener("dragstart", dragPlaced);
	    secondSemester.addEventListener("dragend", dragPlacedEnd);
	
	    secondSemester.firstElementChild.innerText = course.name;
	    secondSemester.children[1].innerHTML = `<span class="location ${course.location}">${course.location}</span> • ` + perTimes[`${course.location}${ev.target.id.charAt(1)}Per`];
	}else if(ev.target.id.includes("S2")) {
	    let firstSemesterId = ev.target.id.replace("S2", "S1")
	    let firstSemester = document.getElementById(firstSemesterId)
	    firstSemester.dataset.classcode = droppedClass;
	    firstSemester.classList.add("notEmpty");
	    firstSemester.setAttribute("draggable", true);
	    firstSemester.addEventListener("dragstart", dragPlaced);
	    firstSemester.addEventListener("dragend", dragPlacedEnd);
	
	    firstSemester.firstElementChild.innerText = course.name;
	    firstSemester.children[1].innerHTML = `<span class="location ${course.location}">${course.location}</span> • ` + perTimes[`${course.location}${ev.target.id.charAt(1)}Per`];
	}
    }
    
    ev.target.firstElementChild.innerText = course.name;
    // sets location and time
    ev.target.children[1].innerHTML = `<span class="location ${course.location}">${course.location}</span> • ` + perTimes[`${course.location}${ev.target.id.charAt(1)}Per`];

    console.log(`${course.location}${ev.target.id.charAt(1)}Per`);
    
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
	    oldClassElement.children[1].innerText = "";
	    
	    if(oldClassElement.id.includes("S1")) {
		var otherSemId = oldClassElement.id.replace("S1", "S2")
	    }else if(oldClassElement.id.includes("S2")) {
		var otherSemId = oldClassElement.id.replace("S2", "S1")
	    }

	    let otherSem = document.getElementById(otherSemId)
	    otherSem.dataset.classcode = null;
	    otherSem.classList.remove("notEmpty");
	    otherSem.setAttribute("draggable", false);
	    otherSem.removeEventListener("dragstart", dragPlaced);
	    otherSem.removeEventListener("dragend", dragPlacedEnd);
	    otherSem.firstElementChild.innerText = "Empty";
	    otherSem.children[1].innerText = "";
	}
    }

    const demand = await requestDemand(course.code, ev.target.id.charAt(1), ev.target.id.substring(3, 5));
    const demandEle = ev.target.querySelector(".demandContainer");
    if (demandEle) {
	demandEle.style.setProperty('--percent', demand.demand+"px");
    }

    saveCurrentSchedule();
    sendCoursesToServer();

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

async function requestDemand(classCode, period, term) { // term is nullable
    const response = await fetch("./scheduler/demand", {
	method: 'POST',
	headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	},
	body: JSON.stringify({
	    code: classCode,
	    period: parseInt(period),
        term: term
	}),
    });

    console.log(response);
    const json = await response.json();
    return json;
}

async function sendCoursesToServer() {
    const periods = [
	"P0-S1-A", "P1-S1-A", "P2-S1-A", "P3-S1-A", "P4-S1-A", "P5-S1-B", "P6-S1-B", "P7-S1-B", "P8-S1-A",
	"P0-S2-A", "P1-S2-A", "P2-S2-A", "P3-S2-A", "P4-S2-A", "P5-S2-B", "P6-S2-B", "P7-S2-B", "P8-S2-A"
    ]

    const items = [{ term: "S1" }, { term: "S2"} ];

    for (let i = 0; i < periods.length; i++) {
	const periodEle = document.getElementById(periods[i]);
	const classID = periodEle.dataset.classcode;
	if(classID == null || classID == "null") continue;
	
	if (classID) {
	    const semester = periods[i].includes("S1") ? 0 : 1;
	    const course = courses.find(a => a.code == classID);

	    const perToWord = `period${intToWord(parseInt(periods[i].charAt(1)))}`

	    if(course) items[semester][perToWord] = course.id;
	}
    }
    
    const response = await fetch("./scheduler", {
	method: 'POST',
	headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	},
	body: JSON.stringify({
	    items: items
	}),
    });

    console.log(response);

    response.json().then(data => {
	//const alertString = JSON.parse(data);
	//console.log(data)
	if (data.reason){
	    alert(data.reason);
	}
	else {
	    alert(data.error);
	}
    });
}

window.onload = function () {
    
    
    //set dark mode
    dmSwitch();
    document.getElementById('button').onclick = function () {
        document.getElementById('modal').style.display = "none"
    };

    document.onclick = function (e) {
	let modal = document.getElementById('modal')
	if(modal.style.display != "none"){
	    if(modal == e.target){
		modal.style.display = "none"
	    }
	}
    }
};
