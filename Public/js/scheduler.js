const classes = document.querySelectorAll('.class');

for (let i = 0; i < classes.length; i++) {
    const classPeriod = classes[i];

    const span = document.createElement('span');
    span.innerHTML = "Empty";

    classPeriod.appendChild(span);
}

const courses = [
    {
	name: "CS 101",
	periods: [1, 2, 3],
	doubleBlock: false
    },
    {
	name: "CS 102",
	periods: [4, 5],
	doubleBlock: true
    }
];

const courseSelect = document.querySelector('#courseSelect');

var selectedCourse = null;

for (let i = 0; i < courses.length; i++) {
    const course = courses[i];

    const courseA = document.createElement('a');
    courseA.innerHTML = course.name;
    courseA.classList.add('course');
    courseA.id = course.name;

    courseSelect.appendChild(courseA);
}

courseSelect.addEventListener('click', function (event) {
    if (event.target.classList.contains('course')) {
	if (selectedCourse != null) {
	    document.getElementById(selectedCourse).classList.remove('selected');
	}

	selectedCourse = event.target.id;
	event.target.classList.add('selected');
    }
    else {
	if (selectedCourse != null) {
	    document.getElementById(selectedCourse).classList.remove('selected');
	}
	selectedCourse = null;
    }
});
