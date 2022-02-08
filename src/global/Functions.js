/*****************************************************
 * Accessibility
 *****************************************************/

export function clickOnEnter(e, callback, ...callbackArgs) {
	if (e.keyCode !== 13) return;

	if (callbackArgs) callback(...callbackArgs);
	else callback(e);
}