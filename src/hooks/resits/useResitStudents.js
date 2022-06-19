import { useQueryClient, useQuery } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function useResitStudents({ campus, expand }, options = {}) {
	/* ---- Queries --------------------------------- */
	const messages = useMessage();
	const queryClient = useQueryClient();
	const resitStudents = useQuery(
		["resitStudents", { campus, expand }],
		async () => (await API.resits.getStudents.fetch(null, { campus, expand })).students,
		{ ...options, onError: err => messages.add(err.type, err, retry) }
	);
	
	/* ---- Mutations ------------------------------- */
	const add = () => {
		invalidateAll();
	};
	
	/* ---- Functions ------------------------------- */
	const isUsable = () => !resitStudents.isLoading && !resitStudents.error;
	
	const invalidateAll = () => {
		queryClient.invalidateQueries("resitStudents").catch(err => messages.add(err.type, err));
	};
	
	const retry = (filter = "error") => {
		if (filter === "error" && resitStudents.error) {
			resitStudents.remove();
			resitStudents.refetch().catch(err => messages.add(err.type, err));
		}
	};
	
	/* ---- Expose hook ----------------------------- */
	return { ...resitStudents, add, isUsable, retry };
}

export default useResitStudents;
