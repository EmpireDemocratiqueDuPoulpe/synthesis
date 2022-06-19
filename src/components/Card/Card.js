import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./Card.css";

function UserIcon({ title, link, fa_icon, logo, children }) {
	return (
		<Link to={link} className="card_link">
			<div className="dashboard_card">
				<div className="card_header">
					<FontAwesomeIcon icon={fa_icon} size={"xl"} color={"#ECEBEAFF"}/>
					<h2>{title}</h2>
				</div>
				<div className="card_body">
					<img alt="card_logo" className="card_logo" id="scts_logo" src={logo}/>
					<p className="card_description">{children}</p>
				</div>
			</div>
		</Link>
	);
}
UserIcon.propTypes = {
	title: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
	fa_icon: PropTypes.any.isRequired,
	logo: PropTypes.any.isRequired,
	children: PropTypes.node.isRequired,
};

export default UserIcon;
