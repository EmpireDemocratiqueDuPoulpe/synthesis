import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Button.css";

function Button({ link, icon, children }) {
	/* ---- Functions ------------------------------- */

	
	/* ---- Page content ---------------------------- */
	return (
		<Wrapper link={link} className="button">
			{icon && (<span className="button-icon">{icon}</span>)}
			{children}
		</Wrapper>
	);
}
Button.propTypes = {
	link: PropTypes.shape({
		to: PropTypes.string.isRequired,
		external: PropTypes.bool /* For some reason, the IDE "thinks" that isRequired means optional. */
	}),
	icon: PropTypes.any,
	children: PropTypes.node
};

function Wrapper({ link, children, ...rest }) {
	return link
		? (link.external ? (<a href={link.to} target="_blank" rel="noreferrer" {...rest}>{children}</a>) : (<Link to={link.to} {...rest}>{children}</Link>))
		: <button {...rest}>{children}</button>;
}
Wrapper.propTypes = {
	link: Button.propTypes.link,
	children: PropTypes.node
};

export default Button;
