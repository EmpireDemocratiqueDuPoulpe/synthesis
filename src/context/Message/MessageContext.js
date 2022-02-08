import { createContext, useContext, useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { isArray, isInteger } from "lodash-es";
import Alert from "../../components/Alert/Alert.js";
import "./MessageContext.css";

/*****************************************************
 * Constants
 *****************************************************/

const MessageContext = createContext(null);

/*****************************************************
 * MessageProvider
 *****************************************************/

export function MessageProvider({ filters: defaultFilters, limit: defaultLimit, children }) {
	/* ---- States ---------------------------------- */
	const location = useLocation();
	const [messages, setMessages] = useState([]);
	const [filters, setFilters] = useState(defaultFilters ?? []);
	const [limit, setLimit] = useState(defaultLimit ?? 3);
	const timerRef = useRef(null);

	/* ---- Effects --------------------------------- */
	useEffect(() => clear(), [location]);
	useEffect(() => (() => clearTimeout(timerRef.current)), []);

	/* ---- Functions ------------------------------- */
	const add = (type, message, onRetry = null) => {
		if (message) {
			setMessages(prevState => [ {type, content: message, onRetry}, ...prevState ]);
		}
	};

	const clear = () => setMessages([]);

	const changeFilters = newFilters => {
		if (isArray(newFilters)) {
			setFilters(newFilters);
		}
	};

	const changeLimit = newLimit => {
		if (isInteger(newLimit)) {
			setLimit(newLimit);
		}
	};

	const onAlertClose = (alert, message) => {
		alert.hide();

		timerRef.current = setTimeout(() => {
			setMessages(prevState => {
				const shallowCopy = [...prevState];
				shallowCopy.splice(prevState.findIndex(m => m.content === message), 1);

				return shallowCopy;
			});
		}, 200); // Same duration as alert.hide() duration
	};

	/* ---- Page content ---------------------------- */
	return (
		<MessageContext.Provider value={{ list: messages, add, clear, setFilters: changeFilters, setLimit: changeLimit }}>
			<div className="message-context-wrapper">
				<div className="message-context">
					{messages.filter(m => filters.every(f => f(m))).slice(0, limit).map((message, index) => (
						<Alert key={`alert-${index}-wrapper`} type={message.type ?? "info"} message={message.content} onRetry={message.onRetry} onClose={onAlertClose}/>
					))}
				</div>

				<div className="mc-page">
					{children}
				</div>
			</div>
		</MessageContext.Provider>
	);
}
MessageProvider.propTypes = {
	filters: PropTypes.arrayOf(PropTypes.func),
	limit: PropTypes.number,
	children: PropTypes.node
};

/*****************************************************
 * Hook
 *****************************************************/

export default function useMessage() {
	return useContext(MessageContext);
}