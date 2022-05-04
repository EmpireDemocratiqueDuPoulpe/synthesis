import { useQueryClient, useQuery } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function useStudents({ expand }, options = {}) {
	/* ---- Queries --------------------------------- */
	const messages = useMessage();
	const queryClient = useQueryClient();
	const students = useQuery(
		["students", { expand }],
		async () => (await API.students.getAll.fetch(null, { expand })).students,
		{ ...options, onError: err => messages.add(err.type, err, retry) }
	);
	
	/* ---- Mutations ------------------------------- */
	const add = () => {
		invalidateAll();
	};
	
	/* ---- Functions ------------------------------- */
	const isUsable = () => !students.isLoading && !students.error;
	
	const invalidateAll = () => {
		queryClient.invalidateQueries("students").catch(err => messages.add(err.type, err));
	};
	
	const retry = (filter = "error") => {
		if (filter === "error" && students.error) {
			students.remove();
			students.refetch().catch(err => messages.add(err.type, err));
		}
	};
	
	/* ---- Expose hook ----------------------------- */
	return { ...students, add, isUsable, retry };
}

export default useStudents;