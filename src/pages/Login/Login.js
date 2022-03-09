import { useState } from "react";
import useAuth from "../../context/Auth/AuthContext.js";

function Login() {
	/* ---- States ---------------------------------- */
	const [user, setUser] = useState({ email: "jay.rate@forni.te", password: "Mot De P4sse" });
	const auth = useAuth();

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

	/* ---- Page content ---------------------------- */
	return (
		<div className="Login">
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
		</div>
	);
}

export default Login;