import { FactoryTimeline } from '$lib/factoryTimeline';
import { Milestone, Task, Timeline, type abstractTimelineInterface } from '$lib/struct.class.svelte';


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
		abstractTimeline.tasks.forEach((abstractTask) => {
			
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
					abstractTask.swimline
				)
			);
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
