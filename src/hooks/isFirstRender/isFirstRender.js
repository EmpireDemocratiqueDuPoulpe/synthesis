import { useRef, useEffect } from "react";

/* eslint-disable react-hooks/rules-of-hooks */
function isFirstRender() {
	/* ---- States ---------------------------------- */
	const isFirstRenderRef = useRef(true);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		isFirstRenderRef.current = false;
	}, []);

	return isFirstRenderRef.current;
}
/* eslint-enable react-hooks/rules-of-hooks */

export default isFirstRender;