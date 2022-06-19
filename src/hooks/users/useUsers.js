import { useQueryClient, useQuery } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function useUsers({ UUID, campus, expand }, options = {}) {
	/* ---- Queries --------------------------------- */
	const messages = useMessage();
	const queryClient = useQueryClient();
	const users = useQuery(
		["users", { UUID, campus, expand }],
		async () => (await API.users.getByUUID.fetch({ UUID }, { campus, expand })).user,
		{ ...options, onError: err => messages.add(err.type, err, retry) }
	);

	/* ---- Mutations ------------------------------- */
	const add = () => {
		invalidateAll();
	};

	/* ---- Functions ------------------------------- */
	const isUsable = () => !users.isLoading && !users.error;

	const invalidateAll = () => {
		queryClient.invalidateQueries("users").catch(err => messages.add(err.type, err));
	};

	const retry = (filter = "error") => {
		if (filter === "error" && users.error) {
			users.remove();
			users.refetch().catch(err => messages.add(err.type, err));
		}
	};

	/* ---- Expose hook ----------------------------- */
	return { ...users, add, isUsable, retry };
}

export default useUsers;