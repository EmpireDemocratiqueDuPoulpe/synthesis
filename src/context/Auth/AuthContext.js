import { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useCookies } from "react-cookie";
import useMessage from "../Message/MessageContext.js";
import { API, Auth } from "../../config/config.js";

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

const initialState = { status: states.DISCONNECTED, isConnected: false, error: null, user: null };

const AuthContext = createContext(undefined);

/*****************************************************
 * AuthProvider
 *****************************************************/

export function AuthProvider(props) {
	/* ---- States ---------------------------------- */
	const messages = useMessage();
	const { instance, inProgress, accounts } = useMsal();
	const isUsingMS = useIsAuthenticated();
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
				return { ...state, status: states.DISCONNECTED, error: null };
			default:
				throw new Error("AuthProvider: Invalid action.type!");
		}
	}, initialState, undefined);
	const navigate = useNavigate();
	const location = useLocation();
	const [, , removeCookie] = useCookies(["tokenPayload"]);

	/* ---- Functions ------------------------------- */
	// ERROR
	const setError = useCallback((err) => {
		dispatch({ type: states.ERROR, error: err });
		messages.add("error", err);
	}, [messages]);

	// LOGOUT
	const setDisconnected = () => dispatch({ type: states.DISCONNECTED });

	const logout = useCallback(() => {
		if (!isUsingMS) {
			removeCookie("tokenPayload", { path: "/" });
		}

		setDisconnected();
	}, [isUsingMS, removeCookie]);

	const msLogout = useCallback(async () => {
		try {
			await instance.logoutPopup();
			setDisconnected();
		} catch (err) {
			setError(err);
		}
	}, [instance, setError]);

	// LOGIN IN PROGRESS
	const setConnecting = () => dispatch({ type: states.CONNECTING });

	// LOGIN
	const setConnected = useCallback((user, availablePermissions) => {
		if (user) {
			dispatch({ type: states.CONNECTED, user: user, permissions: availablePermissions });
		} else {
			setDisconnected();
		}
	}, []);

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
	}, [setConnected, setError, navigate]);

	const msLogin = useCallback(async () => {
		try {
			await instance.loginPopup(Auth.login);
		} catch (err) {
			setError(err);
		}
	}, [instance, setError]);

	const msCallGraph = useCallback(async () => {
		console.log(isUsingMS);
		if (!isUsingMS) return;
		setConnecting();

		const request = { ...Auth.login, account: accounts[0] };
		const getFromGraph = async (accessToken) => {
			const headers = new Headers();
			const bearer = `Bearer ${accessToken}`;

			headers.append("Authorization", bearer);
			const options = { method: "GET", headers };

			try {
				const response = await fetch(Auth.graph.graphMeEndpoint, options);
				const data = response.json();

				// TODO: Permissions system for MS users
				setConnected({
					email: data.userPrincipalName
				}, []);
				console.log(data);
				navigate("/");
			} catch (err) {
				setError(err);
			}
		};

		try {
			const silentResponse = await instance.acquireTokenSilent(request);
			await getFromGraph(silentResponse.accessToken);
		} catch (err) {
			const popupResponse = await instance.acquireTokenPopup(request);
			await getFromGraph(popupResponse.accessToken);
		}
	}, [isUsingMS, accounts, setConnected, navigate, setError, instance]);

	// RELOAD
	const reload = useCallback(async () => {
		if (isUsingMS) navigate.go(0);

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
	}, [isUsingMS, navigate, setConnected, setError]);

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

		if (!auth.user && !isAuthenticating && !isUsingMS && !inProgress) {
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
	}, [auth.user, isUsingMS, inProgress, setConnected, setError]);

	/* ---- Page content ---------------------------- */
	const memoizedAuth = useMemo(
		() => ({ ...auth, isUsingMS, logout, msLogout, login, msLogin, msCallGraph, reload }),
		[auth, isUsingMS, logout, msLogout, login, msLogin, msCallGraph, reload]
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
