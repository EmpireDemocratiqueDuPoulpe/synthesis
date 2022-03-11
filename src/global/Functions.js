/*****************************************************
 * Accessibility
 *****************************************************/

export function clickOnEnter(e, callback, ...callbackArgs) {
	if (e.keyCode !== 13) return;

	if (callbackArgs) callback(...callbackArgs);
	else callback(e);
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