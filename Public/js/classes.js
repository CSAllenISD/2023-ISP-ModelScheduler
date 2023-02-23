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

function addCourse(id) {
    var availableList = document.getElementById("availableCourses");
    var courseItem = document.getElementById(id);
    var course = courseItem.innerText.replace("Add", "");
    
    var selectedList = document.getElementById("selectedCourses");
    var newItem = document.createElement("li");
    //newItem.appendChild(document.createTextNode(course));
    
    const pTag = document.createElement("p");
    pTag.appendChild(document.createTextNode(course));
    newItem.appendChild(pTag)
    
    
    var removeButton = document.createElement("button");
    removeButton.setAttribute("class", "removeButton");
    removeButton.setAttribute("onclick", "removeCourse('" + id + "')");
    removeButton.appendChild(document.createTextNode("Remove"));
    
    newItem.appendChild(removeButton);
    newItem.setAttribute("id", id);
    selectedList.appendChild(newItem);
    
    availableList.removeChild(courseItem);
    
    var courses = [];
    for (const child of selectedList.children) {
	const course = child.innerText.replace("Remove", "");
	courses.push(course);
    }
    localStorage.setItem("courses", courses);
}

function removeCourse(id) {
    var selectedList = document.getElementById("selectedCourses");
    var courseItem = document.getElementById(id);
    var course = courseItem.innerText.replace("Remove", "");
    
    var availableList = document.getElementById("availableCourses");
    var newItem = document.createElement("li");
    //newItem.appendChild(document.createTextNode(course));
    
    const pTag = document.createElement("p");
    pTag.appendChild(document.createTextNode(course));
    newItem.appendChild(pTag)   
    
    var addButton = document.createElement("button");
    addButton.setAttribute("class", "addButton");
    addButton.setAttribute("onclick", "addCourse('" + id + "')");
    addButton.appendChild(document.createTextNode("Add"));
    
    newItem.appendChild(addButton);
    newItem.setAttribute("id", id);
    availableList.appendChild(newItem);
    
    selectedList.removeChild(courseItem);
    
    var courses = [];
    for (const child of selectedList.children) {
	const course = child.innerText.replace("Remove", "");
	courses.push(course);
    }
    localStorage.setItem("courses", courses);
}

function next() {
	var selectedList = document.getElementById("selectedCourses");

	var courses = [];
	for (const child of selectedList.children) {
		const course = child.innerText.replace("Remove", "");
		courses.push(course);
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
		    
		    const courseItem = document.createElement("li");

		    const pTag = document.createElement("p");
		    courseItem.appendChild(pTag)
		    pTag.appendChild(document.createTextNode(course.name));

		    if (savedCourses != null && savedCourses.includes(course.name)) {
			const remButton = document.createElement("button");
			remButton.classList.add("removeButton");
			remButton.onclick = () =>
			removeCourse(course.code + "-" + course.section);
			remButton.appendChild(document.createTextNode("Remove"));
			
			courseItem.appendChild(remButton);
			courseItem.id = course.code + "-" + course.section;
			selectedCourses.appendChild(courseItem);
		    } else {
			const addButton = document.createElement("button");
			addButton.classList.add("addButton");
			addButton.onclick = () => addCourse(course.code + "-" + course.section);
			addButton.appendChild(document.createTextNode("Add"));
			
			courseItem.appendChild(addButton);
			courseItem.id = course.code + "-" + course.section;
			availableCourses.appendChild(courseItem);
		    }
		}
	}
});

//search bar
    function search() {
	// Declare variables
	var input, filter, ul, li, a, i, txtValue;
	input = document.getElementById('search');
	filter = input.value.toUpperCase();
	console.log(filter);
	ul = document.getElementById("availableCourses");
	li = ul.getElementsByTagName('li');

	// Loop through all list items, and hide those who don't match the search query
	for (i = 0; i < li.length; i++) {
	    p = li[i].getElementsByTagName("p")[0];
	    txtValue = p.innerText || p.textContent;
	    console.log(txtValue)
	    if (txtValue.toUpperCase().indexOf(filter) > -1) {
		li[i].style.display = "";
	    } else {
		li[i].style.display = "none";
	    }
	}
    }
