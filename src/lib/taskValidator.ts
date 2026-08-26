export class TaskValidator {
	/**
	 * Validates a date as a valid JS Date object, with an additional arbitrary limit of a 40-unit deviation 
	 * @param dateString 
	 * @returns 
	 */
	static isValidDateString(dateString: string): boolean {
		if (!dateString) return false;
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return false;
		const diff = Math.abs(date.getFullYear() - new Date().getFullYear());
		return diff <= 40;
	}
	/**
	 * Ensures that the date is valid, and that if the second date is also valid, then the first date must precede the second
	 * @param startStr 
	 * @param endStr 
	 * @returns 
	 */
	static isStartDateValid(startStr: string, endStr: string): boolean {
		if (!this.isValidDateString(startStr)) return false;
		if (!this.isValidDateString(endStr)) return true;
		return new Date(startStr) < new Date(endStr);
	}

	/**
	 * Ensures that the date is valid, and that if the second date is also valid, then the first date must precede the second
	 * @param startStr 
	 * @param endStr 
	 * @returns 
	 */
	static isEndDateValid(startStr: string, endStr: string): boolean {
		if (!this.isValidDateString(endStr)) return false;
		if (!this.isValidDateString(startStr)) return true;
		return new Date(startStr) < new Date(endStr);
	}

    static getValideProgression(progression:number):number{
        //Security check
        if( typeof progression !== 'number' || !Number.isInteger(progression)) {
            return 0
        }

		if (progression > 100) {
			return 100;
		}
        return progression
    }
}