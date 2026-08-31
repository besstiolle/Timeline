import { GRID } from './constantes';
import { FactoryTimeline } from './factoryTimeline';
import { Helpers } from './helpers';

export class Card {
	key: string = $state('');
	title: string = $state('');
	lastUpdated: Date | null = $state(null);
	isOnline: boolean = $state(false);
	//Check jsonParser.ts > cardsReviver() function if you add something here.

	constructor(key: string, title: string) {
		this.key = key;
		this.title = title;
		this.lastUpdated = new Date();
		this.isOnline = false;
	}

	toJSON() {
        return { 
			key: this.key, 
			title: this.title, 
			lastUpdated: this.lastUpdated, 
			isOnline: this.isOnline 
		};
    }

	clone():Card {
		let clone = new Card(this.key,this.title);
		clone.lastUpdated = this.lastUpdated;
		clone.isOnline = this.isOnline;
		return clone;
	}
}

export class Timeline {
	key: string = $state('');
	title: string = $state('');
	tasks: Array<Task> = $state(new Array<Task>());
	milestones: Array<Milestone> = $state(new Array<Milestone>());
	isInitiate: boolean = $state(false);
	maxId: number = $state(0);
	showAll: boolean = $state(false);
	isOnline: boolean = $state(false);
	ownerKey: string | null = $state(null);
	writeKey: string | null = $state(null);
	readKey: string | null = $state(null);
	showToday: boolean = $state(true);
	showOutOfBounds: boolean = $state(true);
	dateStartFocus: string | null = $state(null);
	dateEndFocus: string | null = $state(null);
	//Check jsonParser.ts > timelineReviver() function if you add something here.

	constructor(key: string = 'dummy', title: string = 'dummy') {
		this.key = key;
		this.title = title;
	}

	get viewbox(): string{
		//Reprocess viewbox sizing
		let len = this.tasks.length;
		if (!this.showAll) {
			len = Helpers.countVisibleTasksInList(this.tasks);
		}
		return `0 0 ${GRID.ALL_WIDTH} ${GRID.MILESTONE_H + GRID.ANNUAL_H + GRID.ONE_TASK_H * len + GRID.TODAY_H}`;
	}

	get differencial():string{
			const start = FactoryTimeline.getMin(this.tasks, this.milestones, this.showAll);
			const end = FactoryTimeline.getMax(this.tasks, this.milestones, this.showAll);
		
			return Helpers.getEstimationOfDiff(start, end);
	}

	get start():Date{
			return FactoryTimeline.getStartAndEnd(this.tasks, this.milestones, this.showAll, this.differencial).start
	}
	
	get end():Date{
			return FactoryTimeline.getStartAndEnd(this.tasks, this.milestones, this.showAll, this.differencial).end
	}

	toJSON() {
        return { 
			key: this.key, 
			title: this.title, 
			tasks: this.tasks,
			milestones: this.milestones,
			isInitiate: this.isInitiate,
			maxId: this.maxId,
			showAll: this.showAll,
			isOnline: this.isOnline,
			ownerKey: this.ownerKey,
			writeKey: this.writeKey,
			readKey: this.readKey,
			showToday: this.showToday,
			showOutOfBounds: this.showOutOfBounds,
			dateStartFocus: this.dateStartFocus,
			dateEndFocus: this.dateEndFocus
		};
    }

	clone():Timeline {
		let clone = new Timeline(this.key,this.title)
		clone.isInitiate= this.isInitiate;
		clone.maxId= this.maxId;
		clone.showAll= this.showAll;
		clone.isOnline= this.isOnline;
		clone.ownerKey= this.ownerKey;
		clone.writeKey= this.writeKey;
		clone.readKey= this.readKey;
		clone.showToday= this.showToday;
		clone.showOutOfBounds= this.showOutOfBounds;
		clone.dateStartFocus= this.dateStartFocus;
		clone.dateEndFocus= this.dateEndFocus


		const clonedTasks:Task[] = []
		this.tasks.map((task:Task) => clonedTasks.push(task))
		const clonedMilestones:Milestone[] = []
		this.milestones.map((milestone:Milestone) => clonedMilestones.push(milestone))

		clone.tasks = clonedTasks;
		clone.milestones = clonedMilestones;

		return clone
	}

	getNextId(): number {
		this.maxId++;
		return this.maxId;
	}

	getStartFocus(): Date | null {
		if (this.dateStartFocus == null) {
			return null;
		}
		return new Date(this.dateStartFocus);
	}

	getEndFocus(): Date | null {
		if (this.dateEndFocus == null) {
			return null;
		}
		return new Date(this.dateEndFocus);
	}

	setStartFocus(startFocus: Date): void {
		this.dateStartFocus = Helpers.toYYYY_MM_DD(startFocus);
	}

	setEndFocus(endFocus: Date): void {
		this.dateEndFocus = Helpers.toYYYY_MM_DD(endFocus);
	}

	get swimlines():Array<Swimline>{
		console.info("getSwimline")
		const swimlinesToReturn: Swimline[] = [];
		let previousLabel = '';
		let currentSwimline: Swimline | null = null;

		this.tasks.forEach((task, index) => {
			const label = task.swimline;

			if (label !== '') {
				// Create new swimline if label change
				if (label !== previousLabel || !currentSwimline) {
					currentSwimline = new Swimline(swimlinesToReturn.length, label);
					previousLabel = label;
					//Add the swimline to the list
					swimlinesToReturn.push(currentSwimline);
				}
				// add task to swimline
				currentSwimline.tasksIds.push(task.id);
				currentSwimline.tasksIndex.push(index);
			} else {
				previousLabel = '';
				currentSwimline = null;
			}
		});

		console.info("getSwimlines", swimlinesToReturn)

		return swimlinesToReturn;
	}

	set swimlines(s:Array<Swimline>){
		console.warn("loading old Json format with swimline in it.")
	}

	set start(s:string){
		console.warn("start property is readonly.")
	}

	set end(s:string){
		console.warn("end property is readonly.")
	}
	set viewbox(s:string){
		console.warn("viewbox property is readonly.")
	}

	set differencial(s:number){
		console.warn("differencial property is readonly.")
	}
}

export class Task {
	id: number = $state(-1);
	label: string = $state('');
	dateStart: string = $state('');
	dateEnd: string = $state('');
	hasProgress: boolean = $state(false);
	progress: number = $state(-1);
	isShow: boolean = $state(false);
	swimline: string = $state('');

	constructor(
		id: number,
		label: string,
		dateStart: string,
		dateEnd: string,
		hasProgress: boolean,
		progress: number,
		isShow: boolean,
		swimline: string
	) {
		this.id = id;
		this.label = label;
		this.dateStart = dateStart;
		this.dateEnd = dateEnd;
		this.hasProgress = hasProgress;
		this.progress = progress;
		this.isShow = isShow;
		this.swimline = swimline;
	}

	toJSON() {
        return { 
			id: this.id, 
			label: this.label, 
			dateStart: this.dateStart,
			dateEnd: this.dateEnd,
			hasProgress: this.hasProgress,
			progress: this.progress,
			isShow: this.isShow,
			swimline: this.swimline
		};
    }

	getStart(): Date {
		return new Date(this.dateStart);
	}

	getEnd(): Date {
		return new Date(this.dateEnd);
	}

	setStart(start: Date): void {
		this.dateStart = Helpers.toYYYY_MM_DD(start);
	}

	setEnd(end: Date): void {
		this.dateEnd = Helpers.toYYYY_MM_DD(end);
	}

	clone():Task{
		return new Task(
			this.id,
			this.label,
			this.dateStart,
			this.dateEnd,
			this.hasProgress,
			this.progress,
			this.isShow,
			this.swimline
		)
	}
}

export class Milestone {
	id: number = $state(-1);
	label: string = $state('');
	date: string = $state('');
	isShow: boolean = $state(false);

	constructor(id: number, label: string, date: string, isShow: boolean) {
		this.id = id;
		this.label = label;
		this.date = date;
		this.isShow = isShow;
	}
	
	toJSON() {
        return { 
			id: this.id, 
			label: this.label, 
			date: this.date,
			isShow: this.isShow
		};
    }

	getDate(): Date {
		return new Date(this.date);
	}

	setDate(date: Date): void {
		this.date = Helpers.toYYYY_MM_DD(date);
	}

	clone():Milestone{
		return new Milestone(
			this.id,
			this.label,
			this.date,
			this.isShow,
		)
	}
}

export class Swimline {
	id: number;
	label: string = ''; 
	tasksIndex: number[] = [];
	tasksIds: number[] = [];

	constructor(id:number, label: string) {
		this.id = id;
		this.label = label;
	}

	get countAllTasks(): number {
		return this.tasksIndex.length;
	}
}

export interface abstractTimelineInterface {
	title: string;
	version: string;
	tasks: abstractTaskInterface[];
	milestones: abstractMilestoneInterface[];
}
export interface abstractTaskInterface {
	swimline: string;
	label: string;
	start: string;
	end: string;
	progress: number;
	hasProgress: boolean;
	isShow: boolean;
}
export interface abstractMilestoneInterface {
	label: string;
	date: string;
	isShow: boolean;
}

export interface GitVersionMajor {
	latest: string;
	commit: string;
}

export type GitVersions = Record<string, GitVersionMajor>;

export interface Version {
	x: number;
	y: number;
	z: number;
}

/**
 * Represent the object returned on /api/about
 */
export interface AboutInterface {
	version: string;
}
