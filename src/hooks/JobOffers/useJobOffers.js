import { useQueryClient, useQuery } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function useJobOffers({ id, expired }) {
	/* ---- Queries --------------------------------- */
	const messages = useMessage();
	const queryClient = useQueryClient();
	const jobOffers = useQuery(
		["jobOffers", { id, expired }],
		async () => {
			if (id) {
				return (await API.jobOffers.getByID.fetch({ jobOfferID: id })).jobOffer;
			} else {
				return (await API.jobOffers.getAll.fetch(null, { expired })).jobOffers;
			}
		},
		{ onError: (err) => messages.add("error", err, retry) }
	);

	/* ---- Mutations ------------------------------- */
	const add = () => {
		invalidateAll();
	};

	/* ---- Functions ------------------------------- */
	const isUsable = () => !jobOffers.isLoading && !jobOffers.error;

	const invalidateAll = () => {
		queryClient.invalidateQueries("jobOffers").catch(err => messages.add("error", err));
	};

	const retry = (filter = "error") => {
		if (filter === "error" && jobOffers.error) {
			jobOffers.remove();
			jobOffers.refetch().catch(err => messages.add("error", err));
		}
	};

	/* ---- Expose hook ----------------------------- */
	return { ...jobOffers, add, isUsable, retry };
}

export default useJobOffers;