import { useQuery } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

// eslint-disable-next-line no-unused-vars
function useJobDomains(params = {}, options = {}) {
	/* ---- Queries --------------------------------- */
	const messages = useMessage();
	const jobDomains = useQuery(
		["jobDomains", {  }],
		async () => (await API.jobDomains.getAll.fetch()).jobDomains,
		{ ...options, onError: err => messages.add("error", err, retry) }
	);
	
	/* ---- Functions ------------------------------- */
	const isUsable = () => !jobDomains.isLoading && !jobDomains.error;
	
	const retry = (filter = "error") => {
		if (filter === "error" && jobDomains.error) {
			jobDomains.remove();
			jobDomains.refetch().catch(err => messages.add("error", err));
		}
	};
	
	/* ---- Expose hook ----------------------------- */
	return { ...jobDomains, isUsable, retry };
}

export default useJobDomains;
