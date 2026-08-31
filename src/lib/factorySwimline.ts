import { Task } from './struct.class.svelte';

export class FactorySwimline {

	/**
	 * Return the number of tasks visible (task.isShow=true) inside the list of tasks
	 * 	when tasks.swimline equals swimlineName parameter
	 * @param tasks The list of Task to look inside
	 * @param swimlineName The name of swimline
	 * @returns number of tasks visibles
	 */
	static countVisibleTasksInListForSwimlineName(tasks: Task[], swimlineName:string): number {
		return tasks.filter((t) => (t.isShow && t.swimline == swimlineName)).length;
	}

	/**
	 * Return true if at last one task of the list is visible for this swimline
	 * @param tasks The list of Task to look inside
	 * @param swimlineName The name of swimline
	 * @returns boolean 
	 */
	static hasVisibleTasksInListForSwimlineName(tasks: Task[], swimlineName:string): boolean {
		return FactorySwimline.countVisibleTasksInListForSwimlineName(tasks, swimlineName) > 0;
	}

}
