import { useQueryClient, useQuery } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function useCampuses({ campusIDs }, options = {}) {
	/* ---- Queries --------------------------------- */
	const messages = useMessage();
	const queryClient = useQueryClient();
	const campuses = useQuery(
		["campuses", { campusIDs }],
		async () => (await API.campuses.getAll.fetch(null, { campusIDs })).campuses,
		{ ...options, onError: (err) => messages.add(err.type, err, retry) }
	);

	/* ---- Mutations ------------------------------- */
	const add = () => {
		invalidateAll();
	};

	/* ---- Functions ------------------------------- */
	const isUsable = () => !campuses.isLoading && !campuses.error;

	const invalidateAll = () => {
		queryClient.invalidateQueries("modules").catch(err => messages.add(err.type, err));
	};

	const retry = (filter = "error") => {
		if (filter === "error" && campuses.error) {
			campuses.remove();
			campuses.refetch().catch(err => messages.add(err.type, err));
		}
	};

	/* ---- Expose hook ----------------------------- */
	return { ...campuses, add, isUsable, retry };
}

export default useCampuses;
