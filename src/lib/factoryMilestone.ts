import { Milestone, Timeline } from './struct.class';
import { NotFoundException } from './timelineException.class';

export class FactoryMilestone {
	/**
	 * return the values of the Milestone concatenated for CSV with a custom separator
	 * @param milestone the Milestone
	 * @param car the separator
	 * @returns a string with values concatenated for CSV
	 */
	static join(milestone: Milestone, car: string): string {
		return 'milestone' + car + milestone.label + car + milestone.isShow + car + milestone.date;
	}

	/**
	 * Return the Milestone given by its own id
	 * @param timeline the Timeline to look inside
	 * @param id the id of the Milestone
	 * @returns the Milestone found or an exception
	 */
	static getById(timeline: Timeline, id: number): Milestone {
		//A simple loop to reach for the good item because it's cheaper
		// than trying to maintain a map with id => index of array each time
		// we change something into the $store

		let found = null;
		timeline.milestones.forEach((milestone) => {
			if (milestone.id == id) {
				found = milestone;
			}
		});

		if (found) {
			return found;
		}
		throw new NotFoundException('Milestone', id);
	}

	/**
	 * Update the timeline (and return it) with the updated milestone
	 * @param timeline the timeline to update
	 * @param milestoneToUpdate the updated minestone
	 * @returns the timeline updated
	 */
	static updateById(timeline: Timeline, milestoneToUpdate: Milestone): Timeline {
		//A simple loop to reach for the good item because it's cheaper
		// than trying to maintain a map with id => index of array each time
		// we change something into the $store

		let indexFound = -1;
		timeline.milestones.forEach((milestone, index) => {
			if (milestone.id == milestoneToUpdate.id) {
				indexFound = index;
			}
		});

		if (indexFound > -1) {
			timeline.milestones[indexFound] = milestoneToUpdate;
			return timeline;
		}

		throw new NotFoundException('Milestone', milestoneToUpdate.id);
	}

	/**
	 * Clone properly a <Milestone> with all its function.
	 * @param task the milestone to clone
	 * @param nextId the id to apply of the current milestone.id will be used
	 * @param suffix the optionnal suffix for label of the cloned object
	 * @returns the new milestone cloned
	 */
	static clone(milestone: Milestone, nextId?: number, suffix: string = ''): Milestone {
		return new Milestone(
			nextId ? nextId : milestone.id,
			milestone.label + suffix,
			milestone.date,
			milestone.isShow
		);
	}

	/**
	 * Comparator for Milestone. Order by date ASC
	 * @param a the first Milestone
	 * @param b the second Milestone
	 * @returns the comparaison
	 */
	static compare(a: Milestone, b: Milestone) {
		if (a.date > b.date) {
			return 1;
		}
		if (a.date < b.date) {
			return -1;
		}
		return 0;
	}
}
