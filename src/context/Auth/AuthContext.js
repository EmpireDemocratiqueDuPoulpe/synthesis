import { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useCookies } from "react-cookie";
import useMessage from "../Message/MessageContext.js";
import { API } from "../../config/config.js";

/*****************************************************
 * Constants
 *****************************************************/

export const states = {
	"CONNECTING": "CONNECTING",
	"CONNECTED": "CONNECTED",
	"DISCONNECTED": "DISCONNECTED",
	"ERROR": "ERROR",
	"DEL_ERROR": "DEL_ERROR",
};

const initialState = { status: states.CONNECTING, isConnected: false, error: null, user: null };

const AuthContext = createContext(undefined);

/*****************************************************
 * AuthProvider
 *****************************************************/

export function AuthProvider(props) {
	/* ---- States ---------------------------------- */
	const messages = useMessage();
	const [auth, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case states.CONNECTING:
				return { ...state, status: states.CONNECTING, isConnected: false };
			case states.CONNECTED:
				return { ...state, status: states.CONNECTED, isConnected: true, user: action.user, permissions: action.permissions };
			case states.DISCONNECTED:
				return { ...state, status: states.DISCONNECTED, isConnected: false, error: null, user: null };
			case states.ERROR:
				return { ...state, status: states.ERROR, isConnected: false, error: action.error };
			case states.DEL_ERROR:
				return { ...state, error: null };
			default:
				throw new Error("AuthProvider: Invalid action.type!");
		}
	}, initialState, undefined);
	const navigate = useNavigate();
	const location = useLocation();
	const [, , removeCookie] = useCookies(["tokenPayload"]);

	/* ---- Functions ------------------------------- */
	const setConnecting = () => {
		dispatch({ type: states.CONNECTING });
	};

	const setDisconnected = useCallback(() => {
		removeCookie("tokenPayload", { path: "/" });
		dispatch({ type: states.DISCONNECTED });
	}, [removeCookie]);

	const setConnected = useCallback((user, availablePermissions) => {
		if (user) {
			dispatch({ type: states.CONNECTED, user: user, permissions: availablePermissions });
		} else {
			setDisconnected();
		}
	}, [setDisconnected]);

	const setError = useCallback((err) => {
		dispatch({ type: states.ERROR, error: err });
		messages.add("error", err);
	}, [messages]);

	const login = useCallback(async (connectingUser) => {
		try {
			setConnecting();
			const response = await API.users.logIn.fetch({ user: connectingUser });

			if (response.code !== 200) setDisconnected();
			else {
				const permResponse = await API.permissions.getAll.fetch();
				setConnected(response.user, permResponse.permissions);
				navigate("/");
			}
		} catch (err) {
			setError(err);
		}
	}, [setConnected, setDisconnected, setError, navigate]);

	const reload = useCallback(async () => {
		try {
			setConnecting();
			const response = await API.users.authenticate.fetch();

			if (response.code !== 200) setDisconnected();
			else {
				const permResponse = await API.permissions.getAll.fetch();
				setConnected(response.user, permResponse.permissions);
			}
		} catch (err) {
			setError(err ?? "Une erreur inconnue est survenue. Veuillez réessayer plus tard.");
		}
	}, [setConnected, setDisconnected, setError]);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		if (auth.error) {
			dispatch({ type: states.DEL_ERROR });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	useEffect(() => {
		let isMounted = true;
		let isAuthenticating = false;

		if (!auth.user && !isAuthenticating) {
			isAuthenticating = true;
			API.users.authenticate.fetch()
				.then(response => {
					if (isMounted) {
						if (response.code !== 200) setDisconnected();
						else API.permissions.getAll.fetch().then(permResponse => setConnected(response.user, permResponse.permissions));
					}
				})
				.catch(err => setError(err.message))
				.finally(() => { isAuthenticating = false; });
		}

		return () => { isMounted = false; };
	}, [auth.user, setConnected, setDisconnected, setError]);

	/* ---- Page content ---------------------------- */
	const memoizedAuth = useMemo(
		() => ({ ...auth, setConnecting, setConnected, setDisconnected, setError, login, reload }),
		[auth, setConnected, setDisconnected, setError, login, reload]
	);

	return (
		<AuthContext.Provider value={memoizedAuth}>
			{auth.status !== states.CONNECTING && props.children}
		</AuthContext.Provider>
	);
}
AuthProvider.propTypes = { children: PropTypes.node };

/*****************************************************
 * Hook
 *****************************************************/

export default function useAuth() {
	return useContext(AuthContext);
}
