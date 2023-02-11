function updateClassSchedule() {
    const schedule = JSON.parse(window.localStorage.getItem('courses')) ?? {};
    const classList = document.querySelectorAll('.class');

    for (let i = 0; i < classList.length; i++) {
	const span = document.getElementById(classList[i].id).getElementsByTagName("span")[0];

	if (!Object.keys(schedule).some(course => classList[i].id === course)) {
	    span.innerHTML = "Empty";
	} else {
	    span.innerHTML = schedule[classList[i].id];
	}
    }
}

const removeDuplicatesFromObject = (obj, variable) => {
    for (let key in obj) {
	if (obj[key] === variable) {
	    delete obj[key];
	}
    }
    return obj;
};

const classes = document.querySelectorAll('.class');

for (let i = 0; i < classes.length; i++) {
    const classPeriod = classes[i];

    const span = document.createElement('span');
    span.innerHTML = "Empty";
    span.style.pointerEvents = "none";

    classPeriod.appendChild(span);
}

updateClassSchedule();

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
const scheduleViewer = document.querySelector('#scheduleViewer');

var selectedCourse = null;
const classKeyRegExp = /^(?!P[0-8]-(AHS|STE)-[AB]$).+$/g;

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

scheduleViewer.addEventListener('click', function (event) {
    // Check if click target is valid div
    if (classKeyRegExp.test(event.target.id) === true || selectedCourse === null || event.target.id === "scheduleViewer" || event.target.id === "") return;

    // Only allow 1 class in 1 slot
    var currentSchedule = JSON.parse(window.localStorage.getItem("courses")) ?? {};
    currentSchedule = removeDuplicatesFromObject(currentSchedule, selectedCourse);

    // Update JSON of schedule
    currentSchedule[event.target.id] = selectedCourse;
    window.localStorage.setItem("courses", JSON.stringify(currentSchedule));
    document.getElementById(selectedCourse).classList.remove('selected');
    selectedCourse = null;

    // Update scheduleViewer with new schedule
    updateClassSchedule();
});

const semesterSelecters = document.querySelectorAll('.semesterBtn');
for (let i = 0; i < semesterSelecters.length; i++) {
    const semesterSelecter = semesterSelecters[i];
    semesterSelecter.addEventListener('click', function (event) {
	if (event.target.classList.contains('semesterBtn')) {

	    for (let l = 0; l < semesterSelecters.length; l++) {
		const semesterSelecter = semesterSelecters[l];
		semesterSelecter.classList.remove('selected');
	    }

	    event.target.classList.add('selected');
	}
    });
}
