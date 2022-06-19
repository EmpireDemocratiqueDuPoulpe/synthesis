import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import useClassName from "../../hooks/className/useClassName.js";
import "./Button.css";

function Button({ onClick, link, icon, outlined, disabled, color, children }) {
	/* ---- States ---------------------------------- */
	const classes = useClassName(hook => {
		hook.set("button");
		hook.set(`${color}-color`);
		hook.setIf(outlined, "outlined");
		hook.setIf(disabled, "disabled");
	}, [color, outlined, disabled]);
	
	/* ---- Page content ---------------------------- */
	return (
		<Wrapper link={link} className={classes} onClick={onClick} disabled={disabled}>
			{icon && (<span className="button-icon">{icon}</span>)}
			{children}
		</Wrapper>
	);
}
Button.propTypes = {
	onClick: PropTypes.func,
	link: PropTypes.shape({
		to: PropTypes.string.isRequired,
		external: PropTypes.bool /* For some reason, the IDE "thinks" that isRequired means optional. */
	}),
	icon: PropTypes.any,
	outlined: PropTypes.bool,
	disabled: PropTypes.bool,
	color: PropTypes.oneOf([ "primary", "red" ]),
	children: PropTypes.node
};
Button.defaultProps = { color: "primary" };

function Wrapper({ link, onClick, disabled, children, ...rest }) {
	return link
	// eslint-disable-next-line jsx-a11y/anchor-is-valid
		? (link.external ? (<a href={disabled ? "" : link.to} target="_blank" rel="noreferrer" {...rest}>{children}</a>) : (<Link to={disabled ? "" : link.to} {...rest}>{children}</Link>))
		: <button onClick={onClick} {...rest} disabled={disabled}>{children}</button>;
}
Wrapper.propTypes = {
	link: Button.propTypes.link,
	onClick: Button.propTypes.onClick,
	disabled: Button.propTypes.disabled,
	children: PropTypes.node
};

export default Button;
