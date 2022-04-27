import { useState, useCallback, useMemo, useEffect } from "react";

function useClassName(builder, dependencies) {
	/* ---- States ---------------------------------- */
	const [classes, setClasses] = useState(new Map());

	/* ---- Functions ------------------------------- */
	const set = useCallback((className, key = null) => {
		const k = key ?? className;

		if (classes.get(k) === className) return;
		setClasses(prevState => new Map(prevState).set(k, className));
	}, [classes]);

	const setIf = useCallback((condition, trueClassName, key = null) => {
		if (condition) set(trueClassName, key);
		else del(trueClassName, key);
	}, [set]);

	const setIfElse = useCallback((condition, trueClassName, falseClassName, key) => {
		if (condition) set(trueClassName, key);
		else set(falseClassName, key);
	}, [set]);

	const get = useCallback(() => ` ${Array.from(classes, ([, className]) => className).join(" ")}`, [classes]);

	const del = (className = null, key = null) => {
		const k = key ?? className;

		setClasses(prevState => {
			const newState = new Map(prevState);
			newState.delete(k);

			return newState;
		});
	};

	/* ---- States - Part two ----------------------- */
	const memoizedClasses = useMemo(() => get(), [get]);
	const memoizedFunctions = useMemo(() => ({ set, setIf, setIfElse, get, delete: del }), [set, setIf, setIfElse, get]);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		builder(memoizedFunctions);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);

	/* ---- Expose hook ----------------------------- */
	return memoizedClasses;
}

export default useClassName;