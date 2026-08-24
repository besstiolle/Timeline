// A simple reactif class shared between Online|Cards|Upload|+page.svelte and Toast components
// Allow sharing state like "showing / hidding components"
export class toastComponentClassState {
    message = $state('N/A');
	isSuccess = $state(true);
	isVisible = $state(false);
    #isPersisted = $state(false);
	#timeoutId: ReturnType<typeof setTimeout> | null = null;

	show(message: string, isSuccess = true, duration = 3) {
		if (this.#timeoutId) clearTimeout(this.#timeoutId);

		this.message = message;
		this.isSuccess = isSuccess;
		this.isVisible = true;
        this.#isPersisted = duration <= 0

		if (duration > 0) {
			this.#timeoutId = setTimeout(() => {
				this.hide();
			}, duration * 1000);
		}
	}

	hide() {
		if (this.#timeoutId) clearTimeout(this.#timeoutId);
		this.message = 'N/A'
        this.isVisible = false;
        this.#isPersisted = false;
	}

    get isPersisted(){
        return this.#isPersisted
    }
}

// Instance unique partagée dans toute l'application
export const toastComponentState = new toastComponentClassState();