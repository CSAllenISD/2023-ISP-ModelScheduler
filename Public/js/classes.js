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
    dmButton.addEventListener("click", saveDm)
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

function saveDm() {
    if (localStorage.getItem("darkmode") == null || localStorage.getItem("darkmode") == "false") {
	
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

function addCourse(id) {
    var availableList = document.getElementById("availableCourses");
    var courseItem = document.getElementById(id);
    var course = courseItem.innerText.replace("Add", "");

    var selectedList = document.getElementById("selectedCourses");
    var newItem = document.createElement("li");
    newItem.appendChild(document.createTextNode(course));

    var removeButton = document.createElement("button");
    removeButton.setAttribute("class", "removeButton");
    removeButton.setAttribute("onclick", "removeCourse('" + id + "')")
    removeButton.appendChild(document.createTextNode("Remove"))

    newItem.appendChild(removeButton);
    newItem.setAttribute("id", id);
    selectedList.appendChild(newItem);

    availableList.removeChild(courseItem);

    var courses = []
    for (const child of selectedList.children) {
	const course = child.innerText.replace("Remove", "")
	courses.push(course)
    }
    localStorage.setItem("courses", courses)
}

function removeCourse(id) {
    console.log("ID: " + id)
    var selectedList = document.getElementById("selectedCourses");
    var courseItem = document.getElementById(id);
    var course = courseItem.innerText.replace("Remove", "");

    var availableList = document.getElementById("availableCourses");
    var newItem = document.createElement("li");
    newItem.appendChild(document.createTextNode(course));

    var addButton = document.createElement("button");
    addButton.setAttribute("class", "addButton");
    addButton.setAttribute("onclick", "addCourse('" + id + "')");
    addButton.appendChild(document.createTextNode("Add"));

    newItem.appendChild(addButton);
    newItem.setAttribute("id", id);
    availableList.appendChild(newItem);

    selectedList.removeChild(courseItem);

    var courses = []
    for (const child of selectedList.children) {
	const course = child.innerText.replace("Remove", "")
	courses.push(course)
    }
    localStorage.setItem("courses", courses)
}

function next() {
    var selectedList = document.getElementById("selectedCourses")

    var courses = []
    for (const child of selectedList.children) {
	const course = child.innerText.replace("Remove", "")
	courses.push(course)
    }
    localStorage.setItem("courses", courses)

    window.location.replace("index")
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
                console.log(data)
                resolve(data);
            } else {
                console.log(`Error: ${xhr.status}`);
                reject(xhr.status);
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    const availableCourses = document.getElementById("availableCourses");
    const selectedCourses = document.getElementById("selectedCourses");

    const courses = await getCoursesFromServer();

    let savedCourses = localStorage.getItem("courses")
    if(savedCourses != null) {
	savedCourses = savedCourses.split(',')
    }

    console.log(courses);

    // if got the courses from the server without error
    if (courses != null) {
        for (let i = 0; i < courses?.items?.length; i++) {
            const course = courses.items[i];
            console.log(course);

            const courseItem = document.createElement("li");
            courseItem.appendChild(document.createTextNode(course.name));

	    if (savedCourses != null && savedCourses.includes(course.name)) {
		const remButton = document.createElement("button")
		remButton.classList.add("removeButton");
		remButton.onclick = () => removeCourse(course.code + "-" + course.section);
		remButton.appendChild(document.createTextNode("Remove"));
		
		courseItem.appendChild(remButton);
		courseItem.id = course.code + "-" + course.section;
		console.log("COURSE ITEM ID: " + courseItem.id)
		selectedCourses.appendChild(courseItem);
	    }else{
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
