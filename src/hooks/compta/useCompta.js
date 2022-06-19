import { useQueryClient, useQuery } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function useCompta({ UUID }, options = {}) {
	/* ---- Queries --------------------------------- */
	const messages = useMessage();
	const queryClient = useQueryClient();
	const compta = useQuery(
		["compta", { UUID }],
		async () => (await API.comptas.getByUUID.fetch({ UUID })).compta,
		{ ...options, onError: (err) => messages.add(err.type, err, retry) }
	);
	
	/* ---- Mutations ------------------------------- */
	const add = () => {
		invalidateAll();
	};
	
	/* ---- Functions ------------------------------- */
	const isUsable = () => !compta.isLoading && !compta.error;
	
	const invalidateAll = () => {
		queryClient.invalidateQueries("compta").catch(err => messages.add(err.type, err));
	};
	
	const retry = (filter = "error") => {
		if (filter === "error" && compta.error) {
			compta.remove();
			compta.refetch().catch(err => messages.add(err.type, err));
		}
	};
	
	/* ---- Expose hook ----------------------------- */
	return { ...compta, add, isUsable, retry };
}

export default useCompta;
