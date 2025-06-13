import { browser } from '$app/environment';
import { Helpers } from './helpers';
import { FactorySwimline } from './factorySwimline';
import { Milestone, Swimline, Task, Timeline } from './struct.class';
import { DIFF, GRID } from './constantes';
import { DuplicateEntityException } from './timelineException.class';

export class FactoryTimeline {
	/**
	 * Return the min date of all tasks & all minestones.
	 *   If there is no tasks/milestones it return the date of the system
	 * @param timeline the Timeline to investigate
	 * @returns <Date> the min date of milestones & tasks in the Timeline
	 */
	static getMin(timeline: Timeline): Date {
		if (timeline.tasks.length === 0 && timeline.milestones.length === 0) {
			return new Date();
		}

		let min: Date = new Date('2999-12-31');
		timeline.tasks.forEach((task) => {
			if ((timeline.showAll || task.isShow) && min > task.getStart()) {
				min = task.getStart();
			}
		});
		timeline.milestones.forEach((milestone) => {
			if ((timeline.showAll || milestone.isShow) && min > milestone.getDate()) {
				min = milestone.getDate();
			}
		});

		return min;
	}

	/**
	 * Return the max date of all tasks & all minestones.
	 *   If there is no tasks/milestones it return the date of the system
	 * @param timeline the Timeline to investigate
	 * @returns <Date> the max date of milestones & tasks in the Timeline
	 */
	static getMax(timeline: Timeline): Date {
		if (timeline.tasks.length === 0 && timeline.milestones.length === 0) {
			return new Date();
		}

		let max: Date = new Date('1900-01-01');
		timeline.tasks.forEach((task) => {
			if ((timeline.showAll || task.isShow) && max < task.getEnd()) {
				max = task.getEnd();
			}
		});
		timeline.milestones.forEach((milestone) => {
			if ((timeline.showAll || milestone.isShow) && max < milestone.getDate()) {
				max = milestone.getDate();
			}
		});
		return max;
	}

	/**
	 * Add a Task into the Timeline
	 * @param timeline the Timeline to investigate
	 * @param task the Task to add
	 * @return Timeline updated
	 */
	static addTask(timeline: Timeline, task: Task): Timeline {
		timeline.tasks.forEach((element) => {
			if (element.id === task.id) {
				throw new DuplicateEntityException('Task', task.id);
			}
		});

		timeline.tasks.push(task);
		timeline.isInitiate = true;

		return timeline;
	}

	/**
	 * Add a Milestone into the Timeline
	 * @param timeline the Milestone to investigate
	 * @param milestone the Milestone to add
	 * @return Timeline updated
	 */
	static addMilestone(timeline: Timeline, milestone: Milestone): Timeline {
		timeline.milestones.forEach((element) => {
			if (element.id === milestone.id) {
				throw new DuplicateEntityException('Milestone', milestone.id);
			}
		});

		timeline.milestones.push(milestone);
		timeline.isInitiate = true;

		return timeline;
	}

	/**
	 * Remove all data from the Milestone excepted the user choices like "showAll" options
	 * @param timeline the Milestone to purge
	 * @return Timeline updated
	 */
	static purge(timeline: Timeline): Timeline {
		timeline.tasks = new Array<Task>();
		timeline.milestones = new Array<Milestone>();
		timeline.swimlines = new Array<Swimline>();
		timeline.isInitiate = false;
		timeline.start = null;
		timeline.end = null;
		timeline.differencial = null;
		timeline.maxId = 0;
		timeline.viewbox = '0 0 0 0';
		//timeline.showAll = false //Don't reset this parameter
		//timeline.isOnline = false //Don't reset this parameter
		//timeline.ownerKey = null //Don't reset this parameter
		//timeline.writeKey = null //Don't reset this parameter
		//timeline.readKey = null //Don't reset this parameter
		//timeline.key = null //Don't reset this parameter

		return timeline;
	}

	static refresh(timeline: Timeline): Timeline {
		timeline = this._refreshSwimlines(timeline);
		timeline = this._processLimites(timeline);
		timeline = this._processViewboxResizing(timeline);
		return timeline;
	}

	protected static _refreshSwimlines(timeline: Timeline): Timeline {
		timeline.swimlines = new Array<Swimline>();

		let swimlineLabel: string;
		let previousSwimlineLabel = '';
		let previousSwimlineId = -1;

		//Initiate each swimline
		for (let i: number = 0; i < timeline.tasks.length; i++) {
			swimlineLabel = timeline.tasks[i].swimline;
			if (swimlineLabel !== '' && previousSwimlineLabel == swimlineLabel) {
				//reuse id of previous swimline
			} else if (swimlineLabel !== '' && previousSwimlineLabel != swimlineLabel) {
				// create new swimline and save its id
				timeline = FactorySwimline.create(timeline, swimlineLabel);
				previousSwimlineId = timeline.swimlines.length - 1;
			} else {
				//reset previous Swimline id
				previousSwimlineId = -1;
			}
			timeline.tasks[i].swimlineId = previousSwimlineId;
			previousSwimlineLabel = swimlineLabel;
		}
		//update swimlines count of visibles / invisibles tasks
		for (let i: number = 0; i < timeline.tasks.length; i++) {
			if (timeline.tasks[i].swimlineId != -1) {
				timeline.swimlines[timeline.tasks[i].swimlineId].countAllTasks++;
				if (timeline.tasks[i].isShow) {
					timeline.swimlines[timeline.tasks[i].swimlineId].countVisibleTasks++;
				}
			}
		}
		//update swimlines isShow to false if there is no shown task
		for (let i: number = 0; i < timeline.swimlines.length; i++) {
			if (timeline.swimlines[i].countVisibleTasks == 0) {
				timeline.swimlines[i].isShow = false;
			}
		}

		return timeline;
	}

	protected static _processLimites(timeline: Timeline): Timeline {
		const start = FactoryTimeline.getMin(timeline);
		const end = FactoryTimeline.getMax(timeline);

		timeline.differencial = Helpers.getEstimationOfDiff(start, end);

		switch (timeline.differencial) {
			case DIFF.isMoreThan20Years:
			case DIFF.isBetween10YearsAnd20Years:
				start.setFullYear(start.getFullYear() - 1);
				end.setFullYear(end.getFullYear() + 1);
				start.setDate(1);
				end.setDate(1);
				break;
			case DIFF.isBetween6YearsAnd10Years:
			case DIFF.isBetween3YearsAnd6Years:
			case DIFF.isBetween20MonthsAnd3Years:
			case DIFF.isBetween5MonthsAnd20Months:
				if (start.getDate() < 15) {
					start.setMonth(start.getMonth() - 1);
				}
				if (end.getDate() > 15) {
					end.setMonth(end.getMonth() + 2);
				} else {
					end.setMonth(end.getMonth() + 1);
				}
				start.setDate(1);
				end.setDate(1);
				break;
			case DIFF.isBetween1MonthAnd5Months:
				start.setDate(start.getDate() - 5);
				end.setDate(end.getDate() + 5);
				break;
			case DIFF.isBelow1Month:
				start.setDate(start.getDate() - 2);
				end.setDate(end.getDate() + 2);
				break;
		}

		timeline.setStart(start);
		timeline.setEnd(end);

		return timeline;
	}

	protected static _processViewboxResizing(timeline: Timeline): Timeline {
		//Reprocess viewbox sizing
		let len = timeline.tasks.length;
		if (!timeline.showAll) {
			len = Helpers.countVisibleTasksInList(timeline.tasks);
		}
		timeline.viewbox = `0 0 ${GRID.ALL_WIDTH} ${GRID.MILESTONE_H + GRID.ANNUAL_H + GRID.ONE_TASK_H * len + GRID.TODAY_H}`;

		return timeline;
	}

	/**
	 * Initiate a brand new mocked Timeline for demo purpose
	 * @param timeline
	 * @returns
	 */
	static initiate(timeline: Timeline): Timeline {
		if (browser) {
			const swimlines = [
				{
					title: 'Imagine the story',
					tasks: [
						{
							title: 'Find an idea',
							show: true,
							start: 0,
							end: 10,
							progress: 100
						},
						{
							title: 'Define Main characters',
							show: true,
							start: 5,
							end: 10,
							progress: 75
						},
						{
							title: 'Summarise the story',
							show: true,
							start: 15,
							end: 20,
							progress: 20
						},
						{
							title: 'First lines of text',
							show: true,
							start: 20,
							end: 15,
							progress: 10
						}
					]
				},
				{
					title: 'Form the team',
					tasks: [
						{
							title: 'Allocate roles',
							show: true,
							start: 35,
							end: 30,
							progress: 0
						},
						{
							title: 'Choose who will look after the sets and costumes',
							show: true,
							start: 45,
							end: 10,
							progress: 0
						}
					]
				},
				{
					title: 'Prepare the shoot',
					tasks: [
						{
							title: 'Find locations',
							show: true,
							start: 55,
							end: 15,
							progress: 0
						},
						{
							title: 'Prepare props and costumes',
							show: true,
							start: 65,
							end: 10,
							progress: 0
						}
					]
				},
				{
					title: 'Shoot the film',
					tasks: [
						{
							title: 'Shoot the scenes one by one',
							show: true,
							start: 75,
							end: 55,
							progress: 0
						},
						{
							title: 'Check that the sound and image are good',
							show: true,
							start: 80,
							end: 55,
							progress: 0
						}
					]
				},
				{
					title: 'Edit the film',
					tasks: [
						{
							title: 'Put the scenes in order using simple software',
							show: true,
							start: 135,
							end: 10,
							progress: 0
						},
						{
							title: 'Add music or a funny effect',
							show: true,
							start: 135,
							end: 15,
							progress: 0
						},
						{
							title: "Write credits with everyone's first names",
							show: true,
							start: 140,
							end: 5,
							progress: 0
						}
					]
				},
				{
					title: 'Organise the screening',
					tasks: [
						{
							title: 'Make a poster of the film',
							show: true,
							start: 160,
							end: 5,
							progress: 0
						},
						{
							title: 'Invite friends and family',
							show: true,
							start: 160,
							end: 5,
							progress: 0
						}
					]
				},
				{
					title: 'Panic (a little bit)',
					tasks: [
						{
							title: 'Will they really appreciate my work?',
							show: false,
							start: 170,
							end: 5,
							progress: 0
						}
					]
				},
				{
					title: 'Celebrate the release',
					tasks: [
						{
							title: 'Watch the film together',
							show: true,
							start: 180,
							end: 3,
							progress: 0
						},
						{
							title: 'Applaud the whole team and take a souvenir photo',
							show: true,
							start: 183,
							end: 3,
							progress: 0
						}
					]
				}
			];

			const starting = new Date();
			starting.setDate(starting.getDate() - 15);

			let idTask = 0;
			swimlines.forEach((swimline, index) => {
				timeline = FactorySwimline.create(timeline, swimline.title);
				swimline.tasks.forEach((task) => {
					const localStart = new Date(starting);
					localStart.setDate(localStart.getDate() + task.start);
					const localEnd = new Date(starting);
					localEnd.setDate(localEnd.getDate() + task.start + task.end);
					this.addTask(
						timeline,
						new Task(
							idTask,
							task.title,
							Helpers.toYYYY_MM_DD(localStart),
							Helpers.toYYYY_MM_DD(localEnd),
							true,
							task.progress,
							task.show,
							swimline.title,
							index
						)
					);
					idTask++;
				});
			});

			const milestones = [
				{
					title: 'Starting our Movie',
					start: 0,
					show: true
				},
				{
					title: 'One hidden milestones :) ',
					start: 50,
					show: false
				},
				{
					title: "We've almost finished",
					start: 170,
					show: true
				},
				{
					title: 'Ending our project',
					start: 186,
					show: true
				}
			];

			milestones.forEach((milestone) => {
				const localStart = new Date(starting);
				localStart.setDate(localStart.getDate() + milestone.start);
				this.addMilestone(
					timeline,
					new Milestone(idTask, milestone.title, Helpers.toYYYY_MM_DD(localStart), milestone.show)
				);
				idTask++;
			});

			timeline.maxId = idTask;
		}
		return timeline;
	}
}
