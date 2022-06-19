import { useQueryClient, useQuery } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function useSCTs({ campus, expand }, options = {}) {
	/* ---- Queries --------------------------------- */
	const messages = useMessage();
	const queryClient = useQueryClient();
	const scts = useQuery(
		["scts", { campus, expand }],
		async () => (await API.scts.getAll.fetch(null, { campus, expand })).scts,
		{ ...options, onError: err => messages.add(err.type, err, retry) }
	);
	
	/* ---- Mutations ------------------------------- */
	const add = () => {
		invalidateAll();
	};
	
	/* ---- Functions ------------------------------- */
	const isUsable = () => !scts.isLoading && !scts.error;
	
	const invalidateAll = () => {
		queryClient.invalidateQueries("scts").catch(err => messages.add(err.type, err));
	};
	
	const retry = (filter = "error") => {
		if (filter === "error" && scts.error) {
			scts.remove();
			scts.refetch().catch(err => messages.add(err.type, err));
		}
	};
	
	/* ---- Expose hook ----------------------------- */
	return { ...scts, add, isUsable, retry };
}

export default useSCTs;
