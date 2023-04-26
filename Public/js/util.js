function intToWord(num) {
    switch (num) {
    case 0: return "Zero";
    case 1: return "One";
    case 2: return "Two";
    case 3: return "Three";
    case 4: return "Four";
    case 5: return "Five";
    case 6: return "Six";
    case 7: return "Seven";
    case 8: return "Eight";
    case 9: return "Nine";
    default: return "";
    }
}

codesDone = []
mergedClasses = []

function combineCourses(courses) {
    //loop through all objects from database
    for(i=0; i < courses?.items?.length; i++) {
	var course = courses?.items[i];
	if (course.name.toLowerCase().includes("general psych")) {
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
