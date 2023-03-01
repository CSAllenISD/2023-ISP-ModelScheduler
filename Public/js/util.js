const CoursePeriods = {
    0: 1 << 0,
    1: 1 << 1,
    2: 1 << 2,
    3: 1 << 3,
    4: 1 << 4,
    5: 1 << 5,
    6: 1 << 6,
    7: 1 << 7,
    8: 1 << 8,
    9: 1 << 9,
    10: 1 << 10
}

function getPeriodsArray(bitmap) {
    var periods = [];

    var time = 0;
    var periodScan = 1;
    while (bitmap >= periodScan) {
	if (bitmap & periodScan) periods.push(time)
	periodScan <<=1;
	time += 1;
    }

    return periods;
}
