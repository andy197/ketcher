import { h } from 'preact';
/** @jsx h */

import element from '../../chem/element';

import Dialog from '../component/dialog';
import { form as Form, Field } from '../component/form';

export const labelEditSchema = {
	title: "Label Edit",
	type: "object",
	required: ["label"],
	properties: {
		label: {
			title: "Atom",
			default: ''
		}
	}
};

function serialize(lc) {
	var charge = Math.abs(lc.charge);
	var radical = ['', ':', '.', '^^'][lc.radical] || '';
	var sign = '';
	if (charge)
		sign = lc.charge < 0 ? '-' : '+';
	return (lc.isotope || '') + lc.label + radical +
		   (charge > 1 ? charge: '') + sign;
}

function deserialize(value) {
	var match = value.match(/^(\d+)?([a-z*]{1,3})(\.|:|\^\^)?(\d+[-+]|[-+])?$/i); // TODO: radical on last place
	if (match) {
		var label = match[2] == '*' ? 'A' : capitalize(match[2]);
		var charge = 0;
		var isotope = 0;
		var radical = 0;
		if (match[1])
			isotope = parseInt(match[1]);
		if (match[3])
			radical = { ':': 1, '.': 2, '^^': 3 }[match[3]];
		if (match[4]) {
			charge = parseInt(match[4]);
			if (isNaN(charge)) // NaN => [-+]
				charge = 1;
			if (match[4].endsWith('-'))
				charge = -charge;
		}
		// Not consistant
		if (label == 'A' || label == 'Q' || label == 'X' || label == 'M' || element.map[label])
			return { label, charge, isotope, radical };
	}
	return null;
}

function LabelEdit(props) {
	let init = { label: props.letter || serialize(props) };

	return (
		<Form storeName="label-edit" component={Dialog} className="labeledit" ref={el => this.form = el}
			  schema={labelEditSchema} customValid={{label: l => deserialize(l)}}
			  init={init} params={props}
			  result={() => deserialize(this.form.props.stateForm.label)}>
			<Field name="label" maxlength="20" size="10"/>
		</Form>
	);
}

function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export default LabelEdit;
