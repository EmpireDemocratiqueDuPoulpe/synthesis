import { Link } from "react-router-dom";
import useMessage from "../../context/Message/MessageContext.js";
import useAuth, { states } from "../../context/Auth/AuthContext.js";
import AuthorizedLinks from "../../components/AuthorizedLinks/AuthorizedLinks.js";
import { API } from "../../config/config.js";

function Home() {
	/* ---- States ---------------------------------- */
	const messages = useMessage();
	const auth = useAuth();

	/* ---- Functions ------------------------------- */
	const handleTest = () => {
		API.users.getAll.fetch().then(resp => messages.add("success", JSON.stringify(resp))).catch(err => messages.add("error", JSON.stringify(err)));
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="Home">
			<h1>Home</h1>
			<h2>Auth state: {states[auth.status]}</h2>

			{((auth && auth.status === states.CONNECTED) || auth.isUsingMS) ? (
				<>
					<p>User:</p>
					{Object.entries(auth.user).map(([k, v]) => <p key={k} style={{ margin: "0 0 3px 10px", fontSize: "0.8em" }}>{k}: {JSON.stringify(v)}</p>)}
					<p>Errors: {JSON.stringify(auth.error)}</p>

					<button onClick={handleTest}>Tester la connexion</button>
					{auth.isUsingMS ? <button onClick={auth.logout}>Déconnexion</button> : <button onClick={auth.msLogout}>MS Déconnexion</button>}

					<AuthorizedLinks/>
				</>
			) : <Link to="/login">Se connecter</Link>}
		</div>
	);
}

export default Home;