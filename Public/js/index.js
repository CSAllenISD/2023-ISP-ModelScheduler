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
    
    const courses = await getCoursesFromServer();

    console.log(courses)

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
		let classDiv = document.createElement("div");
		classDiv.classList.add("selectedClass");
		classDiv.setAttribute("draggable", true);

		let classP = document.createElement("p")
		classP.appendChild(document.createTextNode(course.name))
		classP.id = 'title'
		
		classDiv.appendChild(classP)

		classes.appendChild(classDiv)
	    }
	}
    }
});
//all the bs for dragging and dropping goes here, wish me luck
//document.addEventListener("DOMContentLoaded", (event) => {


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    console.log("ran")
	console.log(ev.target.innerHTML)
    }

function drop(ev){
	ev.preventDefault();
    ev.target.innerText = "changed";
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
