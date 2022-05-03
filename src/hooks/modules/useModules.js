import { useQueryClient, useQuery } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function useModules({ years }, options = {}) {
	/* ---- Queries --------------------------------- */
	const messages = useMessage();
	const queryClient = useQueryClient();
	const modules = useQuery(
		["modules", { years }],
		async () => (await API.modules.getAll.fetch(null, { years })).modules,
		{ ...options, onError: (err) => messages.add(err.type, err, retry) }
	);

	/* ---- Mutations ------------------------------- */
	const add = () => {
		invalidateAll();
	};

	/* ---- Functions ------------------------------- */
	const isUsable = () => !modules.isLoading && !modules.error;

	const invalidateAll = () => {
		queryClient.invalidateQueries("modules").catch(err => messages.add(err.type, err));
	};

	const retry = (filter = "error") => {
		if (filter === "error" && modules.error) {
			modules.remove();
			modules.refetch().catch(err => messages.add(err.type, err));
		}
	};

	/* ---- Expose hook ----------------------------- */
	return { ...modules, add, isUsable, retry };
}

export default useModules;
