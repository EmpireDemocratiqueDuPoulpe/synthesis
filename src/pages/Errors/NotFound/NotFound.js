import { Link } from "react-router-dom";

function NotFound() {
	return (
		<div className="error-box error-not-found">
			<div className="error-content">
				<h2 className="error-code">404</h2>
				<h3 className="error-message">Tu es perdu ?<br/>Cette page n&apos;existe pas.</h3>
				<Link className="error-link secondary-link" to="/">Retour à l&apos;accueil</Link>
			</div>
		</div>
	);
}

export default NotFound;
