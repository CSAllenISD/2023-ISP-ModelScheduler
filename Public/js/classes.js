document.addEventListener("DOMContentLoaded", function () {
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
});

window.onload = function () {
	dmSwitch();
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

	window.location.replace("index");
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

document.addEventListener("DOMContentLoaded", async function () {
	const availableCourses = document.getElementById("availableCourses");
	const selectedCourses = document.getElementById("selectedCourses");

	const courses = await getCoursesFromServer();

	let savedCourses = localStorage.getItem("courses");

	// if got the courses from the server without error
	if (courses != null) {
		for (let i = 0; i < courses?.items?.length; i++) {
		    const course = courses.items[i];

		    if (document.getElementById(course.code + "SC") == null && document.getElementById(course.code + "AC") == null) {

			const classDivA = getClassDiv(course)
			const classDivS = getClassDiv(course)
			
			const remButton = document.createElement("button");
			remButton.classList.add("removeButton");
			remButton.onclick = () =>
			removeCourse(course.code);
			remButton.appendChild(document.createTextNode("Remove"));

			classDivS.id = course.code + "SC";
			classDivS.appendChild(remButton);

			selectedCourses.appendChild(classDivS);

			const addButton = document.createElement("button");
			addButton.classList.add("addButton");
			addButton.onclick = () => addCourse(course.code);
			addButton.appendChild(document.createTextNode("Add"));

			classDivA.id = course.code + "AC";
			classDivA.appendChild(addButton);
			
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
    
    //create fire demand icons
    let demandDiv = document.createElement("div");
    demandDiv.classList.add("demand");
    classDiv.appendChild(demandDiv);
    
    for(let i = 0; i < 3; i++) {
	let demandImg = document.createElement("img");
	demandImg.src = "images/fire.png"
	demandImg.setAttribute("draggable", false);
	demandDiv.appendChild(demandImg);
    }

    return classDiv
}

//search bar
    function search() {
	// Declare variables
	var input, filter, ul, li, a, i, txtValue;
	input = document.getElementById('search');
	filter = input.value.toUpperCase();
	console.log(filter);

	// Loop through all list items, and hide those who don't match the search query
	classDivs = document.getElementsByClassName("selectedClass");
	for(i=0; i < classDivs.length; i++) {
	    classDiv = classDivs[i];
	    txtValue = classDiv.getElementsByClassName("title")[0].innerHTML;

	    //needs to check if the course is already selected before it display again
	    if (txtValue.toUpperCase().indexOf(filter) > -1) {
		classDiv.style.display = "";
	    } else {
		classDiv.style.display = "none";
	    }
	}
    }
