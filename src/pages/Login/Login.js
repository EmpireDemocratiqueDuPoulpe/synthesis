import { useEffect } from "react";
import useMessage from "../../context/Message/MessageContext.js";

function Login() {
	/* ---- States ---------------------------------- */
	const messages = useMessage();

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		const timer = setTimeout(() => {
			messages.setLimit(4);
			messages.add("success", "Dommage, ça marche");
			messages.add("info", "Dommage, c'est une information");
			messages.add("warning", "Dommage, c'est un avertissement");
			messages.add("error", "Dommage, ça marche pas");
		}, 1000);
		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* ---- Page content ---------------------------- */
	return (
		<>
			<h1>Connexion</h1>

			<fieldset>
				<legend>yo</legend>

				<label>
					<span>E-mail</span>
					<input type="email" name="email"/>
				</label>

				<label>
					<span>Mot de passe</span>
					<input type="password" name="password"/>
				</label>

				<input type="submit" value="Se connecter"/>
			</fieldset>
		</>
	);
}

export default Login;