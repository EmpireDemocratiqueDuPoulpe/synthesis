import { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useCookies } from "react-cookie";
import { isArray } from "lodash-es";
import useMessage from "../Message/MessageContext.js";
import { API } from "../../config/config.js";

/*****************************************************
 * Constants
 *****************************************************/

export const states = { CONNECTING: "CONNECTING", CONNECTED: "CONNECTED", DISCONNECTED: "DISCONNECTED", };
const internalStates = { FAILED_AUTH: "FAILED_AUTH", ERROR: "ERROR", DEL_ERROR: "DEL_ERROR" };

const initialState = { status: states.CONNECTING, isConnected: false, error: null, failedAuth: 0, user: null, permissions: [] };

const AuthContext = createContext(null);

/*****************************************************
 * AuthProvider
 *****************************************************/

export function AuthProvider({ maxAuthTry, children }) {
	/* ---- States ---------------------------------- */
	const messages = useMessage();
	const [auth, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case states.CONNECTING:
				return { ...state, status: states.CONNECTING, isConnected: false };
			case states.CONNECTED:
				return { ...state, status: states.CONNECTED, isConnected: true, failedAuth: 0, user: action.user, permissions: action.permissions };
			case states.DISCONNECTED:
				return { ...state, status: states.DISCONNECTED, isConnected: false, error: null, user: null, permissions: [] };
			case internalStates.FAILED_AUTH:
				return { ...state, status: state.DISCONNECTED, isConnected: false, error: action.error, failedAuth: (state.failedAuth + 1), user: null, permissions: [] };
			case internalStates.ERROR:
				return { ...state, error: action.error };
			case internalStates.DEL_ERROR:
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
	
	const setAuthFailure = error => {
		dispatch({ type: internalStates.FAILED_AUTH, error });
	};
	
	const setError = useCallback(error => {
		dispatch({ type: internalStates.ERROR, error });
		messages.add(error.type, error);
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
			setDisconnected();
			setError(err);
		}
	}, [setConnected, setDisconnected, setError, navigate]);

	const reload = useCallback(async (navigateTo = null) => {
		try {
			setConnecting();
			const response = await API.users.authenticate.fetch();

			if (response.code !== 200) setDisconnected();
			else {
				const permResponse = await API.permissions.getAll.fetch();
				setConnected(response.user, permResponse.permissions);
				if (navigateTo) navigate(navigateTo);
			}
		} catch (err) {
			setDisconnected();
			setError(err ?? "Une erreur inconnue est survenue. Veuillez réessayer plus tard.");
		}
	}, [setConnected, setDisconnected, setError, navigate]);
	
	const hasPermission = useCallback((permission) => {
		if (isArray(permission)) {
			return permission.every(p => hasPermission(p));
		}
		
		if (!auth.permissions[permission]) {
			throw new Error(`AuthProvider: Invalid permission name! [${permission}]`);
		}
		
		return auth.user.position.permissions.includes(permission);
	}, [auth.permissions, auth.user]);

	/* ---- Effects --------------------------------- */
	// auth.error is not a dependency, otherwise the desired effect won't work
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => { if (auth.error) dispatch({ type: internalStates.DEL_ERROR }); }, [location.pathname]);

	useEffect(() => {
		let isCancelled = false;
		
		const authenticate = async () => {
			try {
				const response = await API.users.authenticate.fetch();
				
				if (!isCancelled) {
					if (200 <= response.code && response.code <= 299) {
						const permResponse = await API.permissions.getAll.fetch();
						setConnected(response.user, permResponse.permissions);
					} else setAuthFailure(response.error);
				}
			} catch (err) {
				if (!isCancelled) setAuthFailure(err.message);
			}
		};
		
		if (!auth.isConnected && auth.failedAuth < maxAuthTry) {
			authenticate().catch();
		}
		
		return () => { isCancelled = true; };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth.isConnected, auth.failedAuth, maxAuthTry]);

	/* ---- Page content ---------------------------- */
	const memoizedAuth = useMemo(
		() => ({ ...auth, setConnecting, setConnected, setDisconnected, setError, login, reload, hasPermission}),
		[auth, setConnected, setDisconnected, setError, login, reload, hasPermission]
	);

	return (
		<AuthContext.Provider value={memoizedAuth}>
			{auth.status !== states.CONNECTING && children}
		</AuthContext.Provider>
	);
}
AuthProvider.propTypes = {
	maxAuthTry: PropTypes.number,
	children: PropTypes.node
};
AuthProvider.defaultProps = { maxAuthTry: 1 };

/*****************************************************
 * Hook
 *****************************************************/

export default function useAuth() {
	return useContext(AuthContext);
}
