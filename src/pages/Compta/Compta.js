import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useMessage from "../../context/Message/MessageContext.js";
import useAuth from "../../context/Auth/AuthContext.js";
import { API } from "../../config/config.js";

function Compta() {
	const messages = useMessage();
	const { user } = useAuth();
	const [compta, setCompta] = useState(null);

	useEffect(() => {
		const isFetching = false;

		if (!isFetching) {
			API.comptas.getByUserID.fetch({ userID: user.user_id })
				.then(response => setCompta(response.compta))
				.catch(err => messages.add("error", err.error));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="Compta">
			<Link to="/">&lt;-- Retour</Link>
			{compta && (
				<>
					{Object.entries(compta).map(([k, v]) => <p key={k} style={{ margin: "0 0 3px 10px", fontSize: "0.8em" }}>{k}: {JSON.stringify(v)}</p>)}
				</>
			)}
		</div>
	);
}

export default Compta;