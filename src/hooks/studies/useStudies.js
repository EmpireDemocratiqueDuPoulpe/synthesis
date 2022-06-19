import { useQueryClient, useQuery } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function useStudies({ userID }, options = {}) {
	/* ---- Queries --------------------------------- */
	const messages = useMessage();
	const queryClient = useQueryClient();
	const studies = useQuery(
		["studies", { userID }],
		async () => (await API.studies.getByUserID.fetch({ userID })).study,
		{ ...options, onError: (err) => {
			let addError = true;
			
			if (options.onError) {
				addError = !!options.onError();
			}
			
			if (addError) messages.add(err.type, err, retry);
		}}
	);

	/* ---- Mutations ------------------------------- */
	const add = () => {
		invalidateAll();
	};

	/* ---- Functions ------------------------------- */
	const isUsable = () => !studies.isLoading && !studies.error;

	const invalidateAll = () => {
		queryClient.invalidateQueries("studies").catch(err => messages.add(err.type, err));
	};

	const retry = (filter = "error") => {
		if (filter === "error" && studies.error) {
			studies.remove();
			studies.refetch().catch(err => messages.add(err.type, err));
		}
	};

	/* ---- Expose hook ----------------------------- */
	return { ...studies, add, isUsable, retry };
}

export default useStudies;
