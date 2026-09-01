// A simple reactif class shared between Cards and PopupConfirmation components
// Allow sharing state like "showing / hidding components"
export class popupConfirmationComponentClassState {
	showClassName = $state(false)
	_message: string = $state('');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_validation =  (_args: string[]) => {};
	_validationText: string = $state('');
	_validationArgs: string[] = [];
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_cancelation =  (_args: string[]) => {};
	_cancelationText: string = $state('');
	_cancelationArgs: string[] = [];

	show(
		message: string,
		validation: (args: string[]) => void,
		validationText: string,
		validationArgs: string[],
		cancelation: (args: string[]) => void,
		cancelationText: string,
		cancelationArgs: string[]
	) {
		this.showClassName = true

		this._message = message;
		this._validation = validation;
		this._validationText = validationText;
		this._validationArgs = validationArgs;
		this._cancelation = cancelation;
		this._cancelationText = cancelationText;
		this._cancelationArgs = cancelationArgs;
	}

	doValidation() {
		this.showClassName = false
		this._validation(this._validationArgs);
	}

	doCancelation() {
		this.showClassName = false
		this._cancelation(this._cancelationArgs);
	}
}

// Instance unique partagée dans toute l'application
export const popupConfirmationComponentState = new popupConfirmationComponentClassState();