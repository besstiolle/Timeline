export class MilestoneValidator {
	static isValidDateString(dateString: string): boolean {
		if (!dateString) return false;
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return false;
		const diff = Math.abs(date.getFullYear() - new Date().getFullYear());
		console.info(diff)
		return diff <= 40;
	}
}