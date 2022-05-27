import { useQueryClient, useQuery } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function usePlanning({ year, eventType }, options = {}) {
	/* ---- Queries --------------------------------- */
	const messages = useMessage();
	const queryClient = useQueryClient();
	const planning = useQuery(
		["planning", { year, eventType }],
		async () => (await API.planning.getAll.fetch(null, { year, eventType })).planning,
		{ ...options, onError: (err) => messages.add(err.type, err, retry) }
	);

	/* ---- Mutations ------------------------------- */
	const add = () => {
		invalidateAll();
	};

	/* ---- Functions ------------------------------- */
	const isUsable = () => !planning.isLoading && !planning.error;

	const invalidateAll = () => {
		queryClient.invalidateQueries("planning").catch(err => messages.add(err.type, err));
	};

	const retry = (filter = "error") => {
		if (filter === "error" && planning.error) {
			planning.remove();
			planning.refetch().catch(err => messages.add(err.type, err));
		}
	};

	/* ---- Expose hook ----------------------------- */
	return { ...planning, add, isUsable, retry };
}

export default usePlanning;
