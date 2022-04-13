/*import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import useAuth from "../../context/Auth/AuthContext.js";

function LoginAD() {
	/* ---- States ---------------------------------- * /
	const { inProgress } = useMsal();
	const auth = useAuth();

	/* ---- Effects --------------------------------- * /
	useEffect(() => {
		let isMounted = true;
		let isFetching = false;

		console.log(isMounted, !isFetching, !inProgress);
		if (isMounted && !isFetching && !inProgress) {
			isFetching =  true;
			auth.msCallGraph().catch();
		}

		return  (() => { isMounted = false; });
	}, [auth, inProgress]);

	/* ---- Page content ---------------------------- * /
	return (
		<div className="LoginAD">
			loading...
		</div>
	);
}*/

function LoginAD() {
	return (
		<div className="LoginAD">
			yo
		</div>
	);
}

export default LoginAD;