import { useQueryClient, useQuery } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function useAbsences({ userIDs, years, campusIDs }, options = {}) {
	/* ---- Queries --------------------------------- */
	const messages = useMessage();
	const queryClient = useQueryClient();
	const absences = useQuery(
		["absences", { userIDs, years, campusIDs }],
		async () => (await API.absences.getAll.fetch(null, { userIDs, years, campusIDs })).absences,
		{ ...options, onError: (err) => messages.add(err.type, err, retry) }
	);

	/* ---- Mutations ------------------------------- */
	const add = () => {
		invalidateAll();
	};

	/* ---- Functions ------------------------------- */
	const isUsable = () => !absences.isLoading && !absences.error;

	const invalidateAll = () => {
		queryClient.invalidateQueries("absences").catch(err => messages.add(err.type, err));
	};

	const retry = (filter = "error") => {
		if (filter === "error" && absences.error) {
			absences.remove();
			absences.refetch().catch(err => messages.add(err.type, err));
		}
	};

	/* ---- Expose hook ----------------------------- */
	return { ...absences, add, isUsable, retry };
}

export default useAbsences;
