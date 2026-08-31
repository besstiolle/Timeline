//import { browser } from '$app/environment';
import { Helpers } from './helpers';
import { Milestone, Task, Timeline } from './struct.class.svelte';
import { DuplicateEntityException } from './timelineException.class';
import { DIFF } from './constantes';

export class FactoryTimeline {
	/**
	 * Return the min date of all tasks & all minestones.
	 *   If there is no tasks/milestones it return the date of the system
	 * @param tasks the list of task
	 * @param milestones the list of milestones
	 * @param showAll if we want to see everything, even the hiddens tasks/milestones
	 * @returns <Date> the min date of milestones & tasks in the Timeline
	 */
	static getMin(tasks:Task[], milestones:Milestone[], showAll:boolean): Date {
		const today = new Date();
		if (tasks.length === 0 && milestones.length === 0) {
			return today
		}

		let min: Date|null = null
		tasks.forEach((task) => {
			if ((showAll || task.isShow) && (min == null || min > task.getStart())) {
				min = task.getStart();
			}
		});
		milestones.forEach((milestone) => {
			if ((showAll || milestone.isShow) && (min == null || min > milestone.getDate())) {
				min = milestone.getDate();
			}
		});

		return min?min:today;
	}

	/**
	 * Return the max date of all tasks & all minestones.
	 *   If there is no tasks/milestones it return the date of the system
	 * @param tasks the list of task
	 * @param milestones the list of milestones
	 * @param showAll if we want to see everything, even the hiddens tasks/milestones
	 * @returns <Date> the max date of milestones & tasks in the Timeline
	 */
	static getMax(tasks:Task[], milestones:Milestone[], showAll:boolean): Date {
		const today = new Date();
		if (tasks.length === 0 && milestones.length === 0) {
			return today;
		}

		let max: Date|null = null
		tasks.forEach((task) => {
			if ((showAll || task.isShow) && (max == null || max < task.getEnd())) {
				max = task.getEnd();
			}
		});
		milestones.forEach((milestone) => {
			if ((showAll || milestone.isShow) && (max == null || max < milestone.getDate())) {
				max = milestone.getDate();
			}
		});

		return max?max:today;
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
		timeline.isInitiate = false;
		timeline.maxId = 0;
		//timeline.showAll = false //Don't reset this parameter
		//timeline.isOnline = false //Don't reset this parameter
		//timeline.ownerKey = null //Don't reset this parameter
		//timeline.writeKey = null //Don't reset this parameter
		//timeline.readKey = null //Don't reset this parameter
		//timeline.key = null //Don't reset this parameter

		return timeline;
	}

	static getStartAndEnd(tasks:Task[], milestones:Milestone[], showAll:boolean, differencial:string):{start:Date,end:Date}{
		const start = FactoryTimeline.getMin(tasks, milestones, showAll);
		const end = FactoryTimeline.getMax(tasks, milestones, showAll);
	
		switch (differencial) {
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
	
		return {start: start, end: end}
	}

	/**
	 * Initiate a brand new mocked Timeline for demo purpose
	 * @param timeline
	 * @returns
	 */
	static initiate(timeline: Timeline): Timeline {
		//if (browser) {
			const allTasksGrouped = [
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
			allTasksGrouped.forEach((tasks, index) => {
				tasks.tasks.forEach((task) => {
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
							tasks.title
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
		//}
		return timeline;
	}
}
