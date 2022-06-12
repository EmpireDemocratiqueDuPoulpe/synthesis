import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import useClassName from "../../hooks/className/useClassName.js";
import "./Button.css";

function Button({ onClick, link, icon, outlined, color, children }) {
	/* ---- States ---------------------------------- */
	const classes = useClassName(hook => {
		hook.set("button");
		hook.set(`${color}-color`);
		hook.setIf(outlined, "outlined");
	}, [color, outlined]);
	
	/* ---- Page content ---------------------------- */
	return (
		<Wrapper link={link} className={classes} onClick={onClick}>
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
	color: PropTypes.oneOf([ "primary", "red" ]),
	children: PropTypes.node
};
Button.defaultProps = { color: "primary" };

function Wrapper({ link, onClick, children, ...rest }) {
	return link
		? (link.external ? (<a href={link.to} target="_blank" rel="noreferrer" {...rest}>{children}</a>) : (<Link to={link.to} {...rest}>{children}</Link>))
		: <button onClick={onClick} {...rest}>{children}</button>;
}
Wrapper.propTypes = {
	onClick: Button.propTypes.onClick,
	link: Button.propTypes.link,
	children: PropTypes.node
};

export default Button;
