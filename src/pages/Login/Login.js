import { useState } from "react";
import useMessage from "../../context/Message/MessageContext.js";

function Login() {
	/* ---- States ---------------------------------- */
	const [user, setUser] = useState({ email: "siredward.weakass@caramail.co.uk", password: "Mot De P4sse" });
	const messages = useMessage();

	/* ---- Functions ------------------------------- */
	const handleChange = (event) => {
		const target = event.target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;

		setUser(prevState => ({ ...prevState, [name]: value }));
	};

	const handleLogin = (event) => {
		const uri = "https://localhost:8443/v1/users/login";
		const options = {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			credentials: process.env.NODE_ENV === "production" ? "same-origin" : "include",
			body: JSON.stringify({ user })
		};

		const login = new Promise((resolve, reject) => {
			fetch(uri, options)
				.then(response => response.text().then(text => ({
					status: response.ok,
					data: text
				})))
				.then(response => ({...response, data: (response.data ? JSON.parse(response.data) : {})}))
				.then(response => response.status ? resolve(response.data) : reject(response.data))
				.catch(reject);
		});

		login.then(resp => messages.add("success", JSON.stringify(resp))).catch(err => messages.add("error", err.message));
		event.preventDefault();
	};

	const handleTest = () => {
		const uri = "https://localhost:8443/v1/users/all";
		const options = {
			method: "GET",
			headers: {"Brokilone": "Miam les bons arbres"},
			credentials: process.env.NODE_ENV === "production" ? "same-origin" : "include",
		};

		const users = new Promise((resolve, reject) => {
			fetch(uri, options)
				.then(response => response.text().then(text => ({
					status: response.ok,
					data: text
				})))
				.then(response => ({...response, data: (response.data ? JSON.parse(response.data) : {})}))
				.then(response => response.status ? resolve(response.data) : reject(response.data))
				.catch(reject);
		});

		users.then(resp => messages.add("success", JSON.stringify(resp))).catch(err => messages.add("error", JSON.stringify(err)));
	};

	/* ---- Page content ---------------------------- */
	return (
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

			<button onClick={handleTest}>Tester la connexion</button>
		</>
	);
}

export default Login;