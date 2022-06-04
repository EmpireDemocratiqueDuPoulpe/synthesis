import { useParams } from "react-router-dom";
import useCompta from "../../../hooks/compta/useCompta.js";
import Loader from "../../../components/Loader/Loader.js";

function ComptaByUUID() {
	/* ---- States ---------------------------------- */
	const { UUID } = useParams();
	const compta = useCompta({ UUID });

	/* ---- Page content ---------------------------- */
	return (
		<div className="Compta ComptaByUUID">
			{!compta.isUsable() ? (compta.isLoading && <Loader/>) : (
				Object.entries(compta.data).map(([k, v]) => <p key={k} style={{ margin: "0 0 3px 10px", fontSize: "0.8em" }}>{k}: {JSON.stringify(v)}</p>)
			)}
		</div>
	);
}

export default ComptaByUUID;
