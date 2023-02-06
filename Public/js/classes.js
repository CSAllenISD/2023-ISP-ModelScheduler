function addCourse(id) {
    var availableList = document.getElementById("availableCourses");
    var courseItem = document.getElementById(id);
    var course = courseItem.innerText.replace("Add", "");

    var selectList = document.getElementById("selectedCourses");
    var newItem = document.createElement("li");
    newItem.appendChild(document.createTextNode(course));

    var removeButton = document.createElement("button");
    removeButton.setAttribute("class", "removeButton");
    removeButton.setAttribute("onclick", "removeCourse('" + id + "')")
    removeButton.appendChild(document.createTextNode("Remove"))

    newItem.appendChild(removeButton);
    newItem.setAttribute("id", id);
    selectList.appendChild(newItem);

    availableList.removeChild(courseItem);
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

}

function getCoursesFromServer()  {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "./classes/data");
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
	if (xhr.readyState == 4 && xhr.status == 200) {
	    const data = xhr.response;
	    console.log(data)
	} else {
	    console.log(`Error: ${xhr.status}`);
	}
    }
}

getCoursesFromServer();
