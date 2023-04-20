document.addEventListener("DOMContentLoaded", function () {
	//Waits for HTML DOM content to load
	const dmButton = document.getElementById("darkmodeButton"); //Gets darkMode button id
    dmSwitch();
	if (dmButton) {
		//Checks whether or not button was clicked for debug purposes
		dmButton.addEventListener("click", function () {
			console.log("Button was clicked!");
		});
	} else {
		console.error("Element with id 'darkMode' not found");
	}

    dmButton.addEventListener("click", toggleDm);

    let instructions = localStorage.getItem("classesInstructions")
    if (instructions == null){
	localStorage.setItem("classesInstructions", "true")
    }else {
	document.getElementById('modal').style.display = "none"
    }
});

window.onload = function () {

        
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
		return "true";
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

function addCourse(code) {
    var availableList = document.getElementById("availableCourses");
    // var courseItem = document.getElementById(id);
    // var course = courseItem.innerText.replace("Add", "");
    
    var selectedList = document.getElementById("selectedCourses");
    // var newItem = document.createElement("li");
    // //newItem.appendChild(document.createTextNode(course));
    
    // const pTag = document.createElement("p");
    // pTag.appendChild(document.createTextNode(course));
    // newItem.appendChild(pTag)
    
    
    // var removeButton = document.createElement("button");
    // removeButton.setAttribute("class", "removeButton");
    // removeButton.setAttribute("onclick", "removeCourse('" + id + "')");
    // removeButton.appendChild(document.createTextNode("Remove"));
    
    // newItem.appendChild(removeButton);
    // newItem.setAttribute("id", id);
    // selectedList.appendChild(newItem);
    
    // availableList.removeChild(courseItem);

    const availableCourse = document.getElementById(code + "AC")
    const selectedCourse = document.getElementById(code + "SC")

    availableCourse.style.display = "none";
    selectedCourse.style.display = "inline-block";

    
    var courses = [];
    for (const child of selectedList.children) {
	const course = child.innerText.replace("Remove", "");
	//courses.push(course);
	const id = child.id
	if (child.style.display != "none") {
	    courses.push(id.slice(0, id.length - 2))
	}
    }
    localStorage.setItem("courses", courses);

}

function removeCourse(code) {
    var selectedList = document.getElementById("selectedCourses");
    // var courseItem = document.getElementById(id);
    // var course = courseItem.innerText.replace("Remove", "");
    
    var availableList = document.getElementById("availableCourses");
    // var newItem = document.createElement("li");
    // //newItem.appendChild(document.createTextNode(course));
    
    // const pTag = document.createElement("p");
    // pTag.appendChild(document.createTextNode(course));
    // newItem.appendChild(pTag)   
    
    // var addButton = document.createElement("button");
    // addButton.setAttribute("class", "addButton");
    // addButton.setAttribute("onclick", "addCourse('" + id + "')");
    // addButton.appendChild(document.createTextNode("Add"));
    
    // newItem.appendChild(addButton);
    // newItem.setAttribute("id", id);
    // availableList.appendChild(newItem);
    
    // selectedList.removeChild(courseItem);

    const availableCourse = document.getElementById(code + "AC")
    const selectedCourse = document.getElementById(code + "SC")

    availableCourse.style.display = "inline-block";
    selectedCourse.style.display = "none";    
    
    var courses = [];
    for (const child of selectedList.children) {
    	const course = child.innerText.replace("Remove", "");
     	//courses.push(course);
	const id = child.id
	if (child.style.display != "none") {
     	    courses.push(id.slice(0, id.length - 2))
	}
    }
    localStorage.setItem("courses", courses);

    let schedule = localStorage.getItem("unsavedSchedule")
    if(schedule) {
	let scheduleParsed = JSON.parse(schedule)
	let fall = scheduleParsed["fall"]
	for (var per in fall){
	    if(!localStorage.getItem("courses").includes(fall[per])){
		fall[per] = null
	    }
	}

	scheduleParsed["fall"] = fall
	localStorage.setItem("unsavedSchedule", JSON.stringify(scheduleParsed))
    }
    
}

function next() {
	var selectedList = document.getElementById("selectedCourses");

	var courses = [];
	for (const child of selectedList.children) {
	    const course = child.innerText.replace("Remove", "");
	    //courses.push(course);
	    const id = child.id
	    if (child.style.display != "none") {
		courses.push(id.slice(0, id.length - 2))
	    }
	}
	localStorage.setItem("courses", courses);

	window.location.replace("scheduler");
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
				//console.log(data);
				resolve(data);
			} else {
				console.log(`Error: ${xhr.status}`);
				reject(xhr.status);
			}
		};
	});
}

document.addEventListener("DOMContentLoaded", async function () {
	const availableCourses = document.getElementById("availableCourses");
	const selectedCourses = document.getElementById("selectedCourses");

	var courses = await getCoursesFromServer();
	courses = await combineCourses(courses);
	let savedCourses = localStorage.getItem("courses");

	// if got the courses from the server without error
    if (courses != null) {
	console.log(courses.length)
		for (let i = 0; i < courses.length; i++) {
		    const course = courses[i];
		    //console.log("ran");
		    
		    if (document.getElementById(course.code + "SC") == null && document.getElementById(course.code + "AC") == null) {

			const classDivA = getClassDiv(course)
			const classDivS = getClassDiv(course)
		
			classDivS.onclick = () => removeCourse(course.code);

			classDivS.id = course.code + "SC";
			classDivS.classList.add("selected")
			
			selectedCourses.appendChild(classDivS);

			classDivA.onclick = () => addCourse(course.code);
			classDivA.classList.add("available");
			classDivA.id = course.code + "AC";
			
			availableCourses.appendChild(classDivA)

			const selected = document.getElementById(course.code + "SC");
			const available = document.getElementById(course.code + "AC");
			//hide and show the correct ones
			if (savedCourses != null && savedCourses.includes(course.code)) {
			    available.style.display = "none";
			    selected.style.display = "inline-block";
			} else {
			    available.style.display = "inline-block";
			    selected.style.display = "none";
			}
		    }
		}
	}
});

function getClassDiv(course) {
    //start creating document
    //create class div
    let classDiv = document.createElement("div");
    classDiv.classList.add("selectedClass");
//    classDiv.setAttribute("id", course.code);
    
    //create div which contains title and id
    let textDiv = document.createElement("div");
    textDiv.classList.add("classText");
    classDiv.appendChild(textDiv);
    
    //class text
    let classP = document.createElement("span")
    classP.appendChild(document.createTextNode(course.name))
    classP.classList.add('title')
    textDiv.appendChild(classP)
//    availableCourses.appendChild(classDiv)
    
    //id text
    let idP = document.createElement('span');
    idP.appendChild(document.createTextNode(course.code));
    idP.classList.add("id");
    textDiv.appendChild(idP);
    
    //create period bubbles
    let periodDiv = document.createElement("div");
    periodDiv.classList.add("periods");
    classDiv.appendChild(periodDiv);

    //create location bubble
    let locationP = document.createElement("p");
    locationP.classList.add(`${course.location}`)
    locationP.classList.add("location")
    locationP.appendChild(document.createTextNode(course.location));
    periodDiv.appendChild(locationP);
    
    //loop to create each period bubble
    for (let i = 0; i < 9; i++) {
	let periodP = document.createElement("p");
	periodP.classList.add("period");

	//logic for highlight
	if (course.period.includes(i)) {
	    periodP.classList.add("highlighted");
	}
	
	periodP.appendChild(document.createTextNode(i));
	
	periodDiv.appendChild(periodP)
    }

    return classDiv
}

//search bar
    function search() {
	// Declare variables
	var input, filter, ul, li, a, i, txtValue;
	input = document.getElementById('search');
	filter = input.value.toUpperCase();

	// Loop through all list items, and hide those who don't match the search query
	classDivs = document.getElementsByClassName("selectedClass");

	//find selected courses
	var selectedCourses = []
	for(i=0; i < classDivs.length; i++) {
	    classDiv = classDivs[i];
	    
	    if (classDiv.parentNode.id == "selectedCourses" && window.getComputedStyle(classDiv).display != "none") {
		selectedCourses.push(classDiv.id.slice(0,-2));
	    }
	}
	console.log(selectedCourses)
	
	for(i=0; i < classDivs.length; i++) {
	    classDiv = classDivs[i];
	    txtValue = classDiv.getElementsByClassName("title")[0].innerHTML;

	    //check for certain cases
	    if (classDiv.parentNode.id == "availableCourses" && !selectedCourses.includes(classDiv.id.slice(0,-2))) {
	    //needs to check if the course is already selected before it display again
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
		    classDiv.style.display = "";
		} else {
		    classDiv.style.display = "none";
		}
	    }
	}
    }
