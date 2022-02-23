import { useState } from "react";
import useMessage from "../../context/Message/MessageContext.js";
import useAuth, { states } from "../../context/Auth/AuthContext.js";

function Login() {
	/* ---- States ---------------------------------- */
	const [user, setUser] = useState({ email: "siredward.weakass@caramail.co.uk", password: "Mot De P4sse" });
	const messages = useMessage();
	const auth = useAuth();

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
			{(auth && auth.status === states.CONNECTED) ? (
				<>
					<h1>Auth state: {states[auth.status]}</h1>

					<p>User:</p>
					{Object.entries(auth.user).map(([k, v]) => <p key={k} style={{ margin: "0 0 3px 10px", fontSize: "0.8em" }}>{k}: {JSON.stringify(v)}</p>)}
					<p>Errors: {JSON.stringify(auth.error)}</p>

					<button onClick={handleTest}>Tester la connexion</button>
					<button onClick={auth.setDisconnected}>Déconnexion</button>
				</>
			) : (
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
				</>
			)}
		</>
	);
}

export default Login;