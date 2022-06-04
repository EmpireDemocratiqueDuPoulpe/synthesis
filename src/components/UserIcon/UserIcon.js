import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import defaultAvatar from "../../assets/images/default_avatar.png";
import "./UserIcon.css";

function UserIcon({ user }) {
	return (
		<Link className="user-icon" to={user.position.name === "Étudiant" ? `/student/${user.uuid}` : "#"}>
			<img src={defaultAvatar} alt={`Profil de ${user.first_name} ${user.last_name}`}/>
		</Link>
	);
}
UserIcon.propTypes = {
	user: PropTypes.shape({
		uuid: PropTypes.string.isRequired,
		first_name: PropTypes.string.isRequired,
		last_name: PropTypes.string.isRequired,
		position: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
	}).isRequired
};

export default UserIcon;
