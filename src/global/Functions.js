/*****************************************************
 * ECTS
 *****************************************************/

export function calcECTS(module) {
	const mean = (module.notes && module.notes.length > 0)
		? (module.notes.reduce((acc, value) => acc + value.note, 0) /  module.notes.length)
		: -1;
	const hasPassed = mean >= 10;
	const ects = hasPassed ? module.ects : 0;
	
	return { hasPassed, mean, ects };
}

export const sortStudentsByPassed = students => {
	return students.sort((studA, studB) => (
		(studA.hasPassed === studB.hasPassed) ? 0 : (
			studA.hasPassed ? 1 : (
				studB.hasPassed ? 1 : (
					studA.hasPassed === false ? 1 : -1
				)
			)
		)
	));
};

export const hasPassed = (student, module) => {
	const studentModule = calcECTS(module);
	
	student.hasPassed = (!module || !module.notes) ? null : (module.notes.length === 0 ? null : studentModule.hasPassed);
	student[`mean-${module.module_id}`] = studentModule.mean;
	student.noteCalc = true;
	
	return student;
};

/*****************************************************
 * Accessibility
 *****************************************************/

export function clickOnEnter(e, callback, ...callbackArgs) {
	if (e.keyCode !== 13) return;

	if (callbackArgs) callback(...callbackArgs);
	else callback(e);
}

/*****************************************************
 * Types
 *****************************************************/

/** @see https://stackoverflow.com/a/28475765 */
function typeOf(obj) {
	return {}.toString.call(obj).split(" ")[1].slice(0, -1).toLowerCase();
}

/*****************************************************
 * Sorting
 *****************************************************/

import { get } from "lodash-es";

export function sortObjectArr(propPath, obj1, obj2) {
	const val1 = get(obj1, propPath);
	const val2 = get(obj2, propPath);
	
	if (!val1 && val2) return 1;
	if (!val2 && val1) return -1;
	
	switch (typeOf(val1)) {
		case "string":
			return sortStr(val1, val2);
		case "number":
			return sortNumber(val1, val2);
		case "boolean":
			return sortBool(val1, val2);
	}
}

function sortStr(str1, str2) {
	return str1.localeCompare(str2);
}

function sortNumber(num1, num2) {
	return num1 - num2;
}

function sortBool(bool1, bool2) {
	return (bool1 === bool2) ? 0 : (bool1 ? -1 : 1);
}

/*****************************************************
 * Date
 *****************************************************/

/** @see https://stackoverflow.com/a/54751179/15024857 */
export function isoStrToDate(isoStr) {
	const dateParts = isoStr.split(/\D+/);
	const convertedDate = new Date();

	convertedDate.setUTCFullYear(parseInt(dateParts[0]));
	convertedDate.setUTCMonth(parseInt(dateParts[1]) - 1);
	convertedDate.setUTCDate(parseInt(dateParts[2]));
	convertedDate.setUTCHours(parseInt(dateParts[3]));
	convertedDate.setUTCMinutes(parseInt(dateParts[4]));
	convertedDate.setUTCSeconds(parseInt(dateParts[5]));
	convertedDate.setUTCMilliseconds(parseInt(dateParts[6]));

	let timezoneHoursOffset = 0;

	if (dateParts[7] || dateParts[8]) {
		let timezoneMinutesOffset = 0;

		if (dateParts[8]) {
			timezoneMinutesOffset = parseInt(dateParts[8]) / 60;
		}

		timezoneHoursOffset = parseInt(dateParts[7]) + timezoneMinutesOffset;

		if (isoStr.substring(-6, -5) === "+") {
			timezoneHoursOffset *= -1;
		}
	}

	convertedDate.setHours(convertedDate.getHours() + timezoneHoursOffset);
	return convertedDate;
}
