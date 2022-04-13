// import { useState } from "react";
// import { useMsal } from "@azure/msal-react";
// import { callMsGraph } from "../../../global/Functions.js";
// import { Auth } from "../../../config/config.js";
// import Microsoft from "../Microsoft";

function MicrosoftProfile() {
	/* ---- States ---------------------------------- */
	// const { instance, accounts, inProgress } = useMsal();
	// const [accessToken, setAccessToken] = useState(null);
	// const [graphData, setGraphData] = useState(null);
	// const name = accounts[0] && accounts[0].name;

	/* ---- Functions ------------------------------- */
	/*const requestAccessToken = () => {
		const request = { ...Auth.login, account: accounts[0] };

		instance.acquireTokenSilent(request)
			.then(response => callMsGraph(response.accessToken).then(graphResponse => setGraphData(graphResponse)))
			.catch(() => {
				instance.acquireTokenPopup(request)
					.then((response) => callMsGraph(response.accessToken).then(graphResponse => setGraphData(graphResponse)));
			});
	};*/

	/* ---- Page content ---------------------------- */
	return (
		<div className="microsoft-profile">
			<h5>Bienvenue name</h5>

			{/*{graphData ? (<Microsoft.ProfileData graphData={graphData}/>) : (
				<button onClick={requestAccessToken}>Demander un token d&apos;acc&egrave;s.</button>
			)}*/}
		</div>
	);
}

export default MicrosoftProfile;