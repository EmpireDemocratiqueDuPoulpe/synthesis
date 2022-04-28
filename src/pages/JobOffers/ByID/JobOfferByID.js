import { useParams, useNavigate, Link } from "react-router-dom";
import urljoin from "url-join";
import useJobOffers from "../../../hooks/jobOffers/useJobOffers.js";
import Loader from "../../../components/Loader/Loader.js";
import { API } from "../../../config/config.js";

function JobOfferByID() {
	/* ---- States ---------------------------------- */
	const { jobOfferID } = useParams();
	const jobOffer = useJobOffers({ id: jobOfferID });
	const navigate = useNavigate();

	/* ---- Functions ------------------------------- */
	const handleDelete = () => {
		jobOffer.delete.mutate(jobOfferID, {
			onSuccess: () => navigate("/jobs/offers")
		});
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="JobOffers JobOfferByID">
			<Link to="/jobs/offers">&lt;-- Retour</Link>

			{!jobOffer.isUsable() ? (jobOffer.isLoading && <Loader/>) : (
				<>
					<button onClick={handleDelete}>Supprimer</button>

					<h3>{jobOffer.data.title}</h3>
					<p>{jobOffer.data.type}</p>
					<p>{jobOffer.data.company_name}</p>
					<p>{jobOffer.data.city}, {jobOffer.data.postal_code}</p>
					<div>
						{jobOffer.data.jobDomains.map((domain) => (
							<span key={`job-offer-${jobOffer.data.job_offer_id}-domain-${domain.job_domain_id}`}>{domain.name}</span>
						))}
					</div>

					{jobOffer.data.attachements && (
						<div>
							<span>Fichiers :</span>
							{jobOffer.data.attachements.map((attachement) => (
								<a
									key={`job-offer-${jobOffer.data.job_offer_id}-attachement-${attachement.attachement_id}`}
									href={urljoin(API.files, attachement.path)}
									target="_blank"
									rel="noreferrer"
								>
									{attachement.name} ({attachement.size})
								</a>
							))}
						</div>
					)}


					<div>{jobOffer.data.content}</div>
				</>
			)}
		</div>
	);
}

export default JobOfferByID;
