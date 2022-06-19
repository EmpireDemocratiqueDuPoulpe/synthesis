import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import useJobOffers from "../../../hooks/jobOffers/useJobOffers.js";
import useJobDomains from "../../../hooks/jobDomains/useJobDomains.js";
import Loader from "../../../components/Loader/Loader.js";
import Inputs from "../../../components/Inputs/Inputs.js";
import "./JobOfferAdd.css";

function JobOfferAdd() {
	/* ---- States ---------------------------------- */
	const form = useForm();
	const jobOffers = useJobOffers({}, { enabled: false });
	const jobDomains = useJobDomains();
	const navigate = useNavigate();

	/* ---- Functions ------------------------------- */
	const handleSubmit = data => {
		const formData = new FormData();
		
		const objToFormData = (objName, obj, exclude) => {
			Object.entries(obj).forEach(([key, value]) => {
				if (exclude.includes(key)) return;
				
				let formattedKey = key.split(".").map(k => `[${k}]`).join("");
				formData.append(`${objName}${formattedKey}`, `${value}`);
			});
		};
		
		const arrayToFormData = (arrName, arr) => {
			arr.forEach(value => {
				formData.append(`${arrName}[]`, value);
			});
		};
		
		objToFormData("jobOffer", data, ["attachements", "domains"]);
		arrayToFormData("jobOffer[job_domains]", data.domains);
		
		if (data.attachements.length > 0) {
			arrayToFormData("attachements", Array.from(data.attachements));
		}
		
		// Send the new job offer
		jobOffers.add.mutate(formData, {
			onSuccess: () => navigate("/jobs/offers")
		});
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="JobOffers JobOfferAdd">
			<h2 className="page_title">Ajouter une offre d&apos;emploi</h2>
			{!jobDomains.isUsable() ? (jobDomains.isLoading && <Loader/>) : (
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} encType="multipart/form-data">
						<Inputs.Text name="title" required>
							Titre
						</Inputs.Text>
						
						<Inputs.Select name="type" options={[ {value: "stage", label: "Stage"}, {value: "alternance", label: "Alternance"} ]} required>
							Type
						</Inputs.Select>
						
						<Inputs.Text name="company_name" required>
							Entreprise
						</Inputs.Text>
						
						<Inputs.Address name="address">
							Adresse
						</Inputs.Address>
						
						<Inputs.Date name="expiration_date">
							Date d&apos;expiration
						</Inputs.Date>
						
						<Inputs.Select name="domains" options={jobDomains.data.map(jd => ({ value: jd.job_domain_id, label: jd.name }))} multiple>
							Domaines
						</Inputs.Select>
						
						<Inputs.Textarea name="content" resize={false}>
							Message
						</Inputs.Textarea>
						
						<Inputs.File name="attachements" multiple>
							Joindre des fichiers
						</Inputs.File>
						
						<input className="button primary-color" type="submit" value="Ajouter"/>
					</form>
				</FormProvider>
			)}
		</div>
	);
}

export default JobOfferAdd;
