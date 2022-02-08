import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useClassName from "../../hooks/ClassName/useClassName.js";
import { clickOnEnter } from "../../global/Functions.js";
import "./Alert.css";

function Alert({ type, message, onRetry, onClose }) {
	/* ---- States ---------------------------------- */
	const [pressedClose, setPressedClose] = useState(false);
	const classes = useClassName((hook) => {
		hook.set("alert");
		hook.set(type, "type");
		hook.setIfElse((!!message && !pressedClose), "show", "hide", "state");
	}, [type, message, pressedClose]);

	/* ---- Functions ------------------------------- */
	const toString = () => message ? (message.error ?? message.message ?? message.toString()) : "";

	const show = () => setPressedClose(false);
	const hide = () => setPressedClose(true);

	const handleRetry = () => {
		if (onRetry) {
			onRetry({ show, hide });
		}
	};

	const handleClose = () => {
		if (onClose) {
			onClose({ show, hide }, message);
		} else {
			hide();
		}
	};

	/* ---- Effects --------------------------------- */
	useEffect(() => show(), [message]);

	/* ---- Page content ---------------------------- */
	return (
		<div className={classes}>
			<span className="alert-content">
				{toString()}

				{onRetry && (
					<>
						&nbsp;
						<span className="alert-retry" onClick={handleRetry} onKeyPress={e => clickOnEnter(e, handleRetry)} role="button" tabIndex={0}>Appuyez ici pour réessayer.</span>
					</>
				)}
			</span>

			<span className="alert-close" onClick={handleClose} onKeyPress={e => clickOnEnter(e, handleClose)} role="button" tabIndex={0}>
				[ICÔNE DE CROIX]
			</span>
		</div>
	);
}
Alert.propTypes = {
	type: PropTypes.oneOf([ "success", "info", "warning", "error" ]).isRequired,
	message: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.shape({
			error: PropTypes.string,
			message: PropTypes.string,
			toString: PropTypes.func
		})
	]),
	onRetry: PropTypes.func,
	onClose: PropTypes.func
};

export default Alert;