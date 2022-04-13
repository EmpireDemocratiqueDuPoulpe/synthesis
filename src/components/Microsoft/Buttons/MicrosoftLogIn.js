import useAuth from "../../../context/Auth/AuthContext.js";

function MicrosoftLogIn() {
	/* ---- States ---------------------------------- */
	const auth = useAuth();

	/* ---- Functions ------------------------------- */
	const handleLogin = () => auth.msLogin().catch();

	/* ---- Page content ---------------------------- */
	return (
		<button onClick={handleLogin}>Connexion Microsoft</button>
	);
}

export default MicrosoftLogIn;