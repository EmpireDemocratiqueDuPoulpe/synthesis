import { useQueryClient, useQuery } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function useNotesOfUser({ userID, years }, options = {}) {
	/* ---- Queries --------------------------------- */
	const messages = useMessage();
	const queryClient = useQueryClient();
	const notes = useQuery(
		["notes", { userID, years }],
		async () => (await API.modules.getAllNotesOfUser.fetch({ userID }, { years })).modules,
		{ ...options, onError: (err) => messages.add(err.type, err, retry) }
	);

	/* ---- Mutations ------------------------------- */
	const add = () => {
		invalidateAll();
	};

	/* ---- Functions ------------------------------- */
	const isUsable = () => !notes.isLoading && !notes.error;

	const invalidateAll = () => {
		queryClient.invalidateQueries("notes").catch(err => messages.add(err.type, err));
	};

	const retry = (filter = "error") => {
		if (filter === "error" && notes.error) {
			notes.remove();
			notes.refetch().catch(err => messages.add(err.type, err));
		}
	};

	/* ---- Expose hook ----------------------------- */
	return { ...notes, add, isUsable, retry };
}

export default useNotesOfUser;
