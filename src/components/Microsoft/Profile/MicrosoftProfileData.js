import PropTypes from "prop-types";

function MicrosoftProfileData({ graphData }) {
	/* ---- Page content ---------------------------- */
	return (
		<div className="microsoft-profile-data">
			<p><strong>First Name: </strong> {graphData.givenName}</p>
			<p><strong>Last Name: </strong> {graphData.surname}</p>
			<p><strong>Email: </strong> {graphData.userPrincipalName}</p>
			<p><strong>Id: </strong> {graphData.id}</p>
		</div>
	);
}
MicrosoftProfileData.propTypes = {
	graphData: PropTypes.shape({
		id: PropTypes.string.isRequired,
		givenName: PropTypes.string.isRequired,
		surname: PropTypes.string.isRequired,
		userPrincipalName: PropTypes.string.isRequired
	}).isRequired
};

export default MicrosoftProfileData;