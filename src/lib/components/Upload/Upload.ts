import { FactorySwimline } from '$lib/factorySwimline';
import { FactoryTimeline } from '$lib/factoryTimeline';
import { Milestone, Task, Timeline, type abstractTimelineInterface } from '$lib/struct.class';

export function parseAbstractTimeline(
	newTimeline: Timeline,
	abstractTimeline: abstractTimelineInterface
): Timeline {
	if (abstractTimeline.title) {
		newTimeline.title = abstractTimeline['title'];
	}

	if (abstractTimeline.version) {
		//Nothing right now
	}
	if (abstractTimeline.tasks) {
		let previousSwimline: string;
		let previousSwimlineId: number;

		abstractTimeline.tasks.forEach((abstractTask) => {
			if (abstractTask.swimline !== '' && previousSwimline == abstractTask.swimline) {
				//reuse id of previous swimline
			} else if (abstractTask.swimline !== '' && previousSwimline != abstractTask.swimline) {
				// create new swimline and save its id
				newTimeline = FactorySwimline.create(newTimeline, abstractTask.swimline);
				previousSwimlineId = newTimeline.swimlines.length - 1;
			} else {
				//reset previous Swimline id
				previousSwimlineId = -1;
			}

			newTimeline = FactoryTimeline.addTask(
				newTimeline,
				new Task(
					newTimeline.getNextId(),
					abstractTask.label,
					abstractTask.start,
					abstractTask.end,
					abstractTask.hasProgress === false ? abstractTask.hasProgress : true,
					abstractTask.progress,
					abstractTask.isShow === false ? abstractTask.isShow : true,
					abstractTask.swimline,
					previousSwimlineId
				)
			);

			previousSwimline = abstractTask.swimline;
		});
	}
	if (abstractTimeline['milestones']) {
		abstractTimeline['milestones'].forEach((abstractMilestone) => {
			newTimeline = FactoryTimeline.addMilestone(
				newTimeline,
				new Milestone(
					newTimeline.getNextId(),
					abstractMilestone.label,
					abstractMilestone.date,
					abstractMilestone.isShow === false ? abstractMilestone.isShow : true
				)
			);
		});
	}

	return newTimeline;
}
