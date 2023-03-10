codesDone = []
mergedClasses = []

function combineCourses(courses) {
    //loop through all objects from database
    for(i=0; i < courses?.items?.length; i++) {
	var course = courses?.items[i];
	if (course.name.toLowerCase().includes("ap-gt english iv")) {
	    console.log(course);
	}
	var periods = [];
	
	if (!codesDone.includes(course.code)) {
	    codesDone.push(course.code);
	  
	    //loop to find all the periods offered
	    courses?.items?.forEach(evalCourse => {
		if(evalCourse.code == course.code && !periods.includes(evalCourse.period)) {
		    periods.push(evalCourse.period);
		}
	    });

	    periods.sort();
	    course.period = periods
	    mergedClasses.push(course)
	}
    }

    console.log(mergedClasses);
    return mergedClasses;
}
