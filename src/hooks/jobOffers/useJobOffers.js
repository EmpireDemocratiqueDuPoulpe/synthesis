import { useQueryClient, useQuery, useMutation } from "react-query";
import useMessage from "../../context/Message/MessageContext.js";
import { API } from "../../config/config.js";

function useJobOffers({ id, expired }, options = {}) {
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
		{ ...options, onError: err => messages.add(err.type, err, retry) }
	);

	/* ---- Mutations ------------------------------- */
	const add = useMutation(jobOffer => API.jobOffers.add.fetch(jobOffer), {
		onSuccess: () => invalidateAll(),
		onError: err => messages.add(err.type, err)
	});

	const del = useMutation(jobOfferID => API.jobOffers.delete.fetch({ jobOfferID }), {
		onSuccess: () => invalidateAll(),
		onError: err => messages.add(err.type, err)
	});

	/* ---- Functions ------------------------------- */
	const isUsable = () => !jobOffers.isLoading && !jobOffers.error;

	const invalidateAll = () => {
		queryClient.invalidateQueries("jobOffers").catch(err => messages.add(err.type, err));
	};

	const retry = (filter = "error") => {
		if (filter === "error" && jobOffers.error) {
			jobOffers.remove();
			jobOffers.refetch().catch(err => messages.add(err.type, err));
		}
	};

	/* ---- Expose hook ----------------------------- */
	return { ...jobOffers, add, delete: del, isUsable, retry };
}

export default useJobOffers;