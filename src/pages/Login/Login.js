import { useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import useAuth, { states } from "../../context/Auth/AuthContext.js";
import Microsoft from "../../components/Microsoft/Microsoft.js";

function Login() {
	/* ---- States ---------------------------------- */
	const [user, setUser] = useState({ email: "jay.rate@forni.te", password: "Mot De P4sse" });
	const auth = useAuth();
	const microsoftAuth = useIsAuthenticated();

	/* ---- Functions ------------------------------- */
	const handleChange = (event) => {
		const target = event.target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;

		setUser(prevState => ({ ...prevState, [name]: value }));
	};

	const handleLogin = (event) => {
		auth.login(user);
		event.preventDefault();
	};

	const handleLogout = (event) => {
		auth.setDisconnected();
		event.preventDefault();
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="Login">
			{(auth.status !== states.CONNECTED && !microsoftAuth) ? (
				<>
					<h1>Connexion</h1>

					<form onSubmit={handleLogin}>
						<fieldset>
							<legend>yo</legend>

							<label>
								<span>E-mail</span>
								<input type="email" name="email" value={user.email} onChange={handleChange}/>
							</label>

							<label>
								<span>Mot de passe</span>
								<input type="password" name="password" value={user.password} onChange={handleChange}/>
							</label>

							<input type="submit" value="Se connecter"/>
						</fieldset>
					</form>

					<Microsoft.LogIn/>
				</>
			) : (
				<>
					<h1>D&eacute;connexion</h1>
					<button onClick={handleLogout}>Se d&eacute;connecter</button>
					<Microsoft.LogOut/>
				</>
			)}
		</div>
	);
}

export default Login;