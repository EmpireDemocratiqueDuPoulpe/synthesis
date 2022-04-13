import { useMsal } from "@azure/msal-react";
import { Auth } from "../../config/config.js";

function MicrosoftLogIn() {
	/* ---- States ---------------------------------- */
	const { instance } = useMsal();

	/* ---- Functions ------------------------------- */
	const handleLogin = (instance) => {
		instance.loginRedirect(Auth.login).catch(console.error);
	};

	/* ---- Page content ---------------------------- */
	return (
		<button onClick={() => handleLogin(instance)}>Connexion Microsoft</button>
	);
}

export default MicrosoftLogIn;