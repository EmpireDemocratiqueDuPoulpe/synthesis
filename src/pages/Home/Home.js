import download from "downloadjs";
import useAuth from "../../context/Auth/AuthContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import Button from "../../components/Button/Button.js";
import { API } from "../../config/config.js";
import "./Home.css";

function Home() {
	/* ---- States ---------------------------------- */
	const { user } = useAuth();
	
	/* ---- Functions ------------------------------- */
	const downloadBackup = () => {
		const opts = {
			method: "GET",
			headers: { "Accept": "application/json", "Brokilone": "Miam le bon bois" },
			mode: "cors",
			credentials: "include",
		};
		
		fetch(`${API.url}/backups/download-latest`, opts)
			.then(resp => resp.blob())
			.then(data => download(data, "synthesis-backup.tar.gz", "application/gzip"));
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<div className="Home">
			<h1>Home</h1>
			
			{(user.position.name === "Admin. plateforme") && (
				<>
					<div className="home-box">
						<h2>Exporter/importer des données</h2>
						<p>
							L&apos;exportation et l&apos;importation des donn&eacute;es permettent de travailler avec les fichiers .csv
							utilis&eacute;s pour le chargement automatisé des données par l&apos;ETL.
						</p>
						
						<div className="buttons-box">
							<Button icon={<FontAwesomeIcon icon={solid("download")}/>} outlined disabled>Exporter</Button>
							<Button icon={<FontAwesomeIcon icon={solid("upload")}/>} outlined disabled>Importer</Button>
						</div>
					</div>
					
					<div className="home-box">
						<h2>Sauvegarder/restaurer la base de données</h2>
						<p>
							Si nécessaire, les boutons ci-dessous permettent de sauvegarder et de restaurer des données directement depuis
							la base de données. Là où les fichiers .csv permettent de g&eacute;rer facilement les donn&eacute;es ins&eacute;r&eacute;es
							dans la base de donn&eacute;es, ces fichiers de sauvegarde contiennent des donn&eacute;es au format SQL, apr&egrave;s le
							traitement de ces derni&egrave;res par le serveur.
						</p>
						
						<div className="buttons-box">
							<Button icon={<FontAwesomeIcon icon={solid("download")}/>} onClick={downloadBackup} outlined>Exporter</Button>
							<Button icon={<FontAwesomeIcon icon={solid("upload")}/>} outlined disabled>S&eacute;lectionner un fichier</Button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default Home;
