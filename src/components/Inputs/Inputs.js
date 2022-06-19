import { useFormContext, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import PropTypes from "prop-types";
import useClassName from "../../hooks/className/useClassName.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import "./Inputs.css";

/*****************************************************
 * Input hook
 *****************************************************/

const reactFormProps = [
	"required", "maxLength", "minLength", "max", "min", "pattern", "validate", "valueAsNumber", "valueAsDate", "setValueAs",
	"disabled", "onChange", "onBlur", "value", "shouldUnregister", "deps"
];

function useInput({ props }) {
	/* ---- States ---------------------------------- */
	const form = useFormContext();
	
	/* ---- Functions ------------------------------- */
	const extractFormProps = properties => {
		const inputProps = {};
		const formProps = {};
		
		for (const [key, value] of Object.entries(properties)) {
			if (Object.hasOwnProperty.call(properties, key)) {
				if (reactFormProps.includes(key)) {
					formProps[key] = value;
				} else {
					inputProps[key] = value;
				}
			}
		}
		
		return expose({ ...inputProps, ...form.register(inputProps.name, formProps) }, form);
	};
	
	const expose = (props, form) => ({ props, form });
	
	/* ---- Expose hook ----------------------------- */
	return form ? extractFormProps(props) : expose(props, null);
}

function useRequired(props) {
	/* ---- Expose hook ----------------------------- */
	return (!props.required) ? null : (
		<span className="required-mark">*</span>
	);
}

/*****************************************************
 * Inputs
 *****************************************************/

/* #### Text ####################################
 * ############################################## */

function Text({ children, ...props }) {
	/* ---- States ---------------------------------- */
	const input = useInput({ props });
	const required = useRequired(props);
	
	/* ---- Page content ---------------------------- */
	return (
		<label className="input text">
			<span className="input-wrapper text-like">
				<input type="text" {...input.props}/>
				<span className="input-label">{children}{required}</span>
			</span>
		</label>
	);
}
Text.propTypes = {
	name: PropTypes.string.isRequired,
	/* ONLY IF NOT USING */ value: PropTypes.any,
	/* REACT-HOOK-FORM */ onChange: PropTypes.func,
	children: PropTypes.node,
};

function Textarea({ resize, children, ...props }) {
	/* ---- States ---------------------------------- */
	const input = useInput({ props });
	const required = useRequired(props);
	const classes = useClassName(hook => {
		hook.set("input");
		hook.set("textarea");
		hook.setIf(resize, "resizable");
	}, [resize]);
	
	/* ---- Page content ---------------------------- */
	return (
		<label className={classes}>
			<span className="input-wrapper">
				<textarea {...input.props}/>
				<span className="input-label">{children}{required}</span>
			</span>
		</label>
	);
}
Textarea.propTypes = {
	name: PropTypes.string.isRequired,
	/* ONLY IF NOT USING */ value: PropTypes.any,
	/* REACT-HOOK-FORM */ onChange: PropTypes.func,
	resize: PropTypes.bool,
	children: PropTypes.node,
};
Textarea.defaultProps = { resize: true };

function Email({ children, ...props }) {
	/* ---- States ---------------------------------- */
	const input = useInput({ props });
	const required = useRequired(props);
	
	/* ---- Page content ---------------------------- */
	return (
		<label className="input email">
			<span className="input-wrapper text-like">
				<input type="email" {...input.props}/>
				<span className="input-label">{children}{required}</span>
			</span>
		</label>
	);
}
Email.propTypes = {
	name: PropTypes.string.isRequired,
	/* ONLY IF NOT USING */ value: PropTypes.any,
	/* REACT-HOOK-FORM */ onChange: PropTypes.func,
	children: PropTypes.node,
};

function Password({ children, ...props }) {
	/* ---- States ---------------------------------- */
	const input = useInput({ props });
	const required = useRequired(props);
	
	/* ---- Page content ---------------------------- */
	return (
		<label className="input password">
			<span className="input-wrapper text-like">
				<input type="password" {...input.props}/>
				<span className="input-label">{children}{required}</span>
			</span>
		</label>
	);
}
Password.propTypes = {
	name: PropTypes.string.isRequired,
	/* ONLY IF NOT USING */ value: PropTypes.any,
	/* REACT-HOOK-FORM */ onChange: PropTypes.func,
	children: PropTypes.node,
};

function Address({ enable, children, ...props }) {
	/* ---- States ---------------------------------- */
	const inputStreet = useInput({ props: {...props, name: `${props.name}_street`} });
	const inputCity = useInput({ props: {...props, name: `${props.name}_city`} });
	const inputPostalCode = useInput({ props: {...props, name: `${props.name}_postal_code`} });
	const required = useRequired(props);
	
	/* ---- Page content ---------------------------- */
	return (
		<label className="input address multi">
			<span className="input-wrapper text-like">
				{enable.postalCode && <input className="postal-code" type="text" {...inputPostalCode.props} placeholder="Code postal"/>}
				{enable.city && <input className="city" type="text" {...inputCity.props} placeholder="Ville"/>}
				{enable.street && <input className="street" type="text" {...inputStreet.props} placeholder="Rue"/>}
				<span className="input-label">{children}{required}</span>
			</span>
		</label>
	);
}
Address.propTypes = {
	name: PropTypes.string.isRequired,
	/* ONLY IF NOT USING */ value: PropTypes.any,
	/* REACT-HOOK-FORM */ onChange: PropTypes.func,
	enable: PropTypes.shape({
		street: PropTypes.bool,
		city: PropTypes.bool,
		postalCode: PropTypes.bool,
	}),
	children: PropTypes.node,
};
Address.defaultProps = { enable: {street: true, city: true, postalCode: true} };

/* #### Date & time #############################
 * ############################################## */

function Date({ children, ...props }) {
	/* ---- States ---------------------------------- */
	const input = useInput({ props });
	const required = useRequired(props);
	
	/* ---- Page content ---------------------------- */
	return (
		<label className="input date">
			<span className="input-wrapper text-like">
				<input type="date" {...input.props}/>
				<span className="input-label">{children}{required}</span>
			</span>
		</label>
	);
}
Date.propTypes = {
	name: PropTypes.string.isRequired,
	/* ONLY IF NOT USING */ value: PropTypes.any,
	/* REACT-HOOK-FORM */ onChange: PropTypes.func,
	children: PropTypes.node,
};

/* #### Select ##################################
 * ############################################## */

function Select({ options, children, ...props }) {
	/* ---- States ---------------------------------- */
	const input = useInput({ props });
	const required = useRequired(props);
	const classes = useClassName(hook => {
		hook.set("input");
		hook.set("select");
		hook.setIf(!!props.multiple, "multiple");
	}, [props.multiple]);
	const Label = () => <span className="input-label">{children}{required}</span>;
	
	/* ---- Page content ---------------------------- */
	return (
		<label className={classes}>
			<span className="input-wrapper text-like">
				{(props.multiple ? (
					<>
						<Controller
							name={props.name}
							control={input.form.control}
							defaultValue={props.defaultValue ?? []}
							render={({ field: {onChange, onBlur, value, ref} }) => (
								<ReactSelect
									styles={{
										option: provided => ({
											...provided,
											color: "#2E2E2E"
										}),
										container: (provided) => ({ ...provided, flexGrow: 1 }),
										control: (provided) => {
											let longestText = "";
											options.map(o => { longestText = (o.label.length > longestText.length) ? o.label : longestText; });
										
											return (
												{
													...provided,
													minWidth: `${(longestText.length / 1.5).toFixed()}em`,
													border: "thin #D3D3D3 solid",
													borderLeft: "none",
													borderRadius: "0 5px 5px 0",
												}
											);
										}}}
									inputRef={ref}
									value={options.filter(o => value.includes(o.value))}
									options={options}
									onChange={value => onChange(value.map(v => v.value))}
									onBlur={onBlur}
									isMulti/>
							)}
						/>
						<Label/>
					</>
				) : (
					<>
						<select {...input.props}>
							{options.map(option => (
								<option key={`${option.label}-${option.value}`} value={option.value}>{option.label}</option>
							))}
						</select>
						{(!props.multiple) && <Label/>}
					</>
				))}
			</span>
		</label>
	);
}
Select.propTypes = {
	name: PropTypes.string.isRequired,
	/* ONLY IF NOT USING */ value: PropTypes.any,
	/* REACT-HOOK-FORM */ onChange: PropTypes.func,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.any.isRequired,
			label: PropTypes.string.isRequired
		})
	).isRequired,
	defaultValue: PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
	multiple: PropTypes.bool,
	children: PropTypes.node,
};

/* #### Checkbox & radio ########################
 * ############################################## */

function Checkbox({ children, ...props }) {
	/* ---- States ---------------------------------- */
	const input = useInput({ props });
	const required = useRequired(props);
	const classes = useClassName(hook => {
		hook.set("input");
		hook.set("checkbox");
		hook.setIf(!!props.value, "active");
	}, [props.value]);
	
	/* ---- Page content ---------------------------- */
	return (
		<label className={classes}>
			<span className="input-wrapper">
				<input type="checkbox" {...input.props}/>
				<span className="input-label">{children}{required}</span>
			</span>
		</label>
	);
}
Checkbox.propTypes = {
	name: PropTypes.string.isRequired,
	/* ONLY IF NOT USING */ value: PropTypes.any,
	/* REACT-HOOK-FORM */ onChange: PropTypes.func,
	children: PropTypes.node,
};

/* #### File ####################################
 * ############################################## */
function File({ children, ...props }) {
	/* ---- States ---------------------------------- */
	const input = useInput({ props });
	const required = useRequired(props);
	const files = input.form.watch(props.name);
	
	/* ---- Function -------------------------------- */
	const getLabel = () => {
		if (!files || files.length === 0) return null;
		return files.length === 1 ? files[0].name : `${files.length} fichiers sélectionnés`;
	};
	
	/* ---- Page content ---------------------------- */
	return (
		<label className="input file">
			<input type="file" {...input.props}/>
			<span className="input-label button outline primary-color">
				<FontAwesomeIcon className="input-icon" icon={solid("upload")}/>
				{getLabel() ?? children}{required}
			</span>
		</label>
	);
}
File.propTypes = {
	name: PropTypes.string.isRequired,
	/* ONLY IF NOT USING */ value: PropTypes.any,
	/* REACT-HOOK-FORM */ onChange: PropTypes.func,
	children: PropTypes.node,
};

/*****************************************************
 * Export
 *****************************************************/

export default {
	/* TEXT */ Text, Textarea, Email, Password, Address,
	/* DATE & TIME */ Date,
	/* SELECT */ Select,
	/* CHECKBOX & RADIO */ Checkbox,
	/* FILE */ File,
};
