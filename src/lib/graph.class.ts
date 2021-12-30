
import { Helpers } from './helpers.class';

export module Graph {

	export class Data {
		tasks : Array<Task>
        milestones : Array<Milestone>

		constructor(tasks : Array<Task> = [], milestones : Array<Milestone> = []){
			this.tasks = tasks
			this.milestones = milestones
		}

		addTask(task: Task) : Data{
			this.tasks.push(task)
			return this
		}

		addMilestone(milestone: Milestone) : Data{
			this.milestones.push(milestone)
			return this
		}
	}

	export class Task {
		

		label: string
		dateStart: Date
		dateEnd: Date
		progress: number
	
		constructor(label : string, dateStart : Date, dateEnd : Date, progress : number = 0) {
		this.label = label;
		this.dateStart = dateStart;
		this.dateEnd = dateEnd;
		this.progress = progress;
		}

		join(car : string){
		
			return "task" + car + this.label + car + Helpers.toISODateString(this.dateStart) + car + Helpers.toISODateString(this.dateEnd) + car + this.progress
		}
	}

	export class Milestone {
		label: string
		date: Date
	
		constructor(label : string, date : Date) {
		this.label = label;
		this.date = date;
		}

		join(car : string){
			return "milestone" + car + this.label + car + Helpers.toISODateString(this.date)
		}
	}
}