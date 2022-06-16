import { createContext, useContext, useReducer, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { isEqual } from "lodash-es";
import isFirstRender from "../../hooks/isFirstRender/isFirstRender.js";

/*****************************************************
 * Constants
 *****************************************************/

const internalStates = { UPDATE_CONF: "UPDATE_CONF", RESET: "RESET" };

const initialState = { navMenu: true, header: true, padding: true };

const PageDisplayContext = createContext(null);

/*****************************************************
 * PageDisplayProvider
 *****************************************************/

export function PageDisplayProvider({ children }) {
	/* ---- States ---------------------------------- */
	const location = useLocation();
	const firstRender = isFirstRender();
	const [config, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case internalStates.UPDATE_CONF:
				return { ...state, ...action.conf };
			case internalStates.RESET:
				return initialState;
			default:
				throw new Error("PageDisplayProvider: Invalid action.type!");
		}
	}, initialState, undefined);
	
	/* ---- Effects --------------------------------- */
	useEffect(() => { if (!firstRender) reset(); }, [firstRender, location]);
	
	/* ---- Functions ------------------------------- */
	const updateConfig = newConf => {
		const mergedConf = { ...config, ...newConf };
		
		if (!isEqual(config, mergedConf)) {
			dispatch({ type: internalStates.UPDATE_CONF, conf: newConf });
		}
	};
	
	const reset = () => {
		dispatch({ type: internalStates.RESET });
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<PageDisplayContext.Provider value={{ ...config, update: updateConfig, reset }}>
			{children}
		</PageDisplayContext.Provider>
	);
}
PageDisplayProvider.propTypes = {
	children: PropTypes.node
};

/*****************************************************
 * Hook
 *****************************************************/

export default function usePageDisplay() {
	return useContext(PageDisplayContext);
}
