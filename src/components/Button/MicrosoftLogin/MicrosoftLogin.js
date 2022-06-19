import PropTypes from "prop-types";
import { isFunction } from "lodash-es";
import useClassName from "../../../hooks/className/useClassName.js";
import { ReactComponent as MicrosoftLogo } from "../../../assets/images/microsoft_icon/ms-symbollockup_mssymbol_19.svg";
import { clickOnEnter } from "../../../global/Functions.js";
import "./MicrosoftLogin.css";

function MicrosoftLogin({ label, onClick, disabled, style }) {
	/* ---- States ---------------------------------- */
	const classes = useClassName(hook => {
		hook.set("microsoft-button");
		hook.set("microsoft-login");
		hook.setIf(disabled, "disabled");
		hook.set(style);
	}, [disabled, style]);

	/* ---- Functions ------------------------------- */
	const handleClick = event => {
		if (isFunction(onClick)) {
			onClick(event);
		}
	};

	/* ---- Page content ---------------------------- */
	return (
		<button className={classes} onClick={handleClick} onKeyDown={e => clickOnEnter(e, handleClick)} disabled={disabled}>
			<span className="microsoft-logo">
				<MicrosoftLogo/>
			</span>

			<span className="label">
				{label ?? "Connexion avec Microsoft"}
			</span>
		</button>
	);
}
MicrosoftLogin.propTypes = {
	label: PropTypes.string,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
	style: PropTypes.oneOf(["light", "dark"])
};
MicrosoftLogin.defaultProps = { style: "light" };

export default MicrosoftLogin;