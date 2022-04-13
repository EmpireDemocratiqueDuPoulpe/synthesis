import useAuth from "../../../context/Auth/AuthContext.js";

function MicrosoftLogOut() {
	/* ---- States ---------------------------------- */
	const auth = useAuth();

	/* ---- Functions ------------------------------- */
	const handleLogout = () => auth.msLogout().catch();

	/* ---- Page content ---------------------------- */
	return (
		<button onClick={handleLogout}>D&eacute;connexion Microsoft</button>
	);
}

export default MicrosoftLogOut;