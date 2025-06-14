import { Task, type Timeline } from './struct.class';
import { NotFoundException } from './timelineException.class';

export class FactoryTask {
	/**
	 * return the values of the Task concatenated for CSV with a custom separator
	 * @param milestone the Task
	 * @param car the separator
	 * @returns a string with values concatenated for CSV
	 */
	static join(task: Task, car: string): string {
		return (
			'task' +
			car +
			task.label +
			car +
			task.isShow +
			car +
			task.dateStart +
			car +
			task.dateEnd +
			car +
			task.hasProgress +
			car +
			task.progress +
			car +
			task.swimline
		);
	}

	/**
	 * Return the Task given by its own id
	 * @param timeline the Timeline to look inside
	 * @param id the id of the Task
	 * @returns the Task found or an exception
	 */
	static getById(timeline: Timeline, id: number): Task {
		//A simple loop to reach for the good item because it's cheaper
		// than trying to maintain a map with id => index of array each time
		// we change something into the $store

		let found = null;
		timeline.tasks.forEach((task) => {
			if (task.id == id) {
				found = task;
			}
		});

		if (found) {
			return found;
		}
		throw new NotFoundException('Task', id);
	}

	/**
	 * Update the timeline (and return it) with the updated task
	 * @param timeline the timeline to update
	 * @param taskToUpdate the updated task
	 * @returns the timeline updated
	 */
	static updateById(timeline: Timeline, taskToUpdate: Task): Timeline {
		//A simple loop to reach for the good item because it's cheaper
		// than trying to maintain a map with id => index of array each time
		// we change something into the $store

		let indexFound = -1
		timeline.tasks.forEach((task, index) => {
			if (task.id == taskToUpdate.id) {
				indexFound = index;
			}
		});

		if (indexFound > -1) {
			timeline.tasks[indexFound] = taskToUpdate
			return timeline;
		}
		throw new NotFoundException('Task', taskToUpdate.id);
	}

	/**
	 * Clone properly a <Task> with all its function.
	 * @param task the task to clone
	 * @param nextId the id to apply of the current task.id will be used
	 * @param suffix the optionnal suffix for label of the cloned object
	 * @returns the new task cloned
	 */
	static clone(task: Task, nextId?: number, suffix: string = ''): Task {
		return new Task(
			nextId ? nextId : task.id,
			task.label + suffix,
			task.dateStart,
			task.dateEnd,
			task.hasProgress,
			task.progress,
			task.isShow,
			task.swimline,
			task.swimlineId
		);
	}
}
