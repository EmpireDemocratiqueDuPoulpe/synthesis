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
	if (e.key !== "Enter") return;

	if (callbackArgs) callback(...callbackArgs);
	else callback(e);
}

export function eventOnElement(callback, ...callbackArgs) {
	return {
		onClick: () => callback(...callbackArgs),
		onKeyDown: e => clickOnEnter(e, callback, ...callbackArgs),
		role: "button",
		tabIndex: 0
	};
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
		case "date":
			return sortDate(val1, val2);
	}
}

export function sortStr(str1, str2) {
	return str1.localeCompare(str2);
}

export function sortNumber(num1, num2) {
	return num1 - num2;
}

export function sortBool(bool1, bool2) {
	return (bool1 === bool2) ? 0 : (bool1 ? -1 : 1);
}

export function sortDate(date1, date2) {
	return isoStrToDate(date1) - isoStrToDate(date2);
}

/*****************************************************
 * Filtering
 *****************************************************/

export function filterObj(obj, props, search) {
	return Object.keys(obj).some(k => {
		const fullKey = props.filter(p => p.includes(k));

		if (fullKey.length === 0) {
			return false;
		}

		return `${get(obj, fullKey[0], "")}`.toLowerCase().includes(search.toLowerCase());
	});
}

/*****************************************************
 * Date
 *****************************************************/

/** @see https://stackoverflow.com/a/54751179/15024857 */
export function isoStrToDate(isoStr) {
	if (typeOf(isoStr) === "date") {
		return isoStr;
	}
	
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

/*****************************************************
 * Numbers
 *****************************************************/

export function toNumeralAdjective(number, feminine = false) {
	if (typeOf(number) !== "number") return null;
	
	switch (number) {
		case 1:
			return feminine ? "re" : "er";
		case 2:
			return feminine ? "de" : "d";
		default:
			return "e";
	}
}

const toCurrencyOptions = { plusSign: false, inverted: false, currency: "EUR" };
export function toCurrency(number, options = toCurrencyOptions) {
	const opts = { ...toCurrencyOptions, ...options };
	const amount = opts.inverted ? (Math.abs(number) * -1) : number;
	const signStr = (opts.plusSign && (amount > 0)) ? "+" : "";
	
	return signStr + new Intl.NumberFormat("fr-FR", { style: "currency", currency: opts.currency }).format(amount);
}

/*****************************************************
 * Strings
 *****************************************************/

export function capitalize(str) {
	return (str && (str[0].toUpperCase() + str.slice(1))) || "";
}

/*****************************************************
 * Bytes
 *****************************************************/

/** @see https://stackoverflow.com/a/18650828 */
export function formatBytes(bytes, decimals = 2) {
	if (bytes === 0) return "O B";
	
	const k = 1024;
	const dec = Math.max(decimals, 0);
	const sizes = [ "B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ];
	
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dec))} ${sizes[i]}`;
}
