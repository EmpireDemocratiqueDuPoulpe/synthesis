import { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { isEqual } from "lodash-es";

/*****************************************************
 * Constants
 *****************************************************/

const internalStates = { SET_PATH: "SET_PATH", UPDATE_CONF: "UPDATE_CONF", RESET: "RESET" };

const themes = ["light", "dark"];
const storedTheme = localStorage.getItem("theme");
const initialState = { theme: (themes.includes(storedTheme) ? storedTheme : themes[0]), navMenu: true, header: true, padding: true };

const PageDisplayContext = createContext(null);

/*****************************************************
 * PageDisplayProvider
 *****************************************************/

export function PageDisplayProvider({ children }) {
	/* ---- States ---------------------------------- */
	const location = useLocation();
	const [config, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case internalStates.SET_PATH:
				return { ...state, path: action.path };
			case internalStates.UPDATE_CONF: {
				const { path, ...newConf } = action.conf;

				if (path) {
					console.warn("PageDisplayProvider: The path cannot be changed.");
				}

				return { ...state, ...newConf };
			}
			case internalStates.RESET:
				return { ...initialState, theme: state.theme, path: action.path };
			default:
				throw new Error("PageDisplayProvider: Invalid action.type!");
		}
	}, initialState, undefined);
	
	/* ---- Functions ------------------------------- */
	const setPath = path => {
		dispatch({ type: internalStates.SET_PATH, path });
	};

	const updateConfig = useCallback(newConf => {
		const mergedConf = { ...config, ...newConf };

		if (!isEqual(config, mergedConf)) {
			dispatch({ type: internalStates.UPDATE_CONF, conf: newConf });
		}
	}, [config]);
	
	const switchTheme = useCallback(() => {
		const newTheme = config.theme === "light" ? "dark" : "light";
		localStorage.setItem("theme", newTheme);
		
		updateConfig({ theme: newTheme });
	}, [config.theme, updateConfig]);
	
	const reset = useCallback(newPath => {
		if (newPath !== config.path) {
			dispatch({ type: internalStates.RESET, path: newPath });
		}
	}, [config.path]);

	/* ---- Effects --------------------------------- */
	useEffect(() => setPath(location.pathname), [location.pathname]);
	useEffect(() => reset(location.pathname), [reset, location.pathname]);
	
	/* ---- Page content ---------------------------- */
	const contextValue = useMemo(
		() => ({ ...config, update: updateConfig, switchTheme, reset }),
		[config, updateConfig, switchTheme, reset]
	);

	return (
		<PageDisplayContext.Provider value={contextValue}>
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
