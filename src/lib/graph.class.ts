import { Helpers } from './helpers.class';
import { browser } from "$app/env";

export module Graph {

	export class Data {
		
		tasks : Array<Task> = new Array<Task>()
        milestones : Array<Milestone> = new Array<Milestone>()
		isInitiate : boolean = false

		constructor(){
		}

		addTask(task: Task) : Data{
			this.tasks.push(task)
			this.isInitiate = true
			return this
		}

		addMilestone(milestone: Milestone) : Data{
			this.milestones.push(milestone)
			this.isInitiate = true
			return this
		}

		purge() : void{
			this.tasks = new Array<Task>()
			this.milestones = new Array<Milestone>()
			this.isInitiate = false
		}

		initiate() : Data{
			if(browser){
				let localData: Data = JSON.parse(localStorage.getItem("store"), Helpers.dateTimeReviver)
									
				if(localData && localData.isInitiate){
					return localData
				}  else {
					return this._initiate()
				}
			} else {
				return this._initiate()
			}
			
		}

		_initiate() : Data{
			return this
				.addTask(new Graph.Task("Random Task 0", new Date("2021-01-15"), new Date("2021-04-01"),100))
				.addTask(new Graph.Task("Random Task 1", new Date("2021-12-01"), new Date("2022-04-01")))
				.addTask(new Graph.Task("Random Task 2", new Date("2021-02-01"), new Date("2021-03-05"),15))
				.addTask(new Graph.Task("Random Task 3", new Date("2021-03-10"), new Date("2021-03-30"),0))
				.addTask(new Graph.Task("Random Task 4", new Date("2021-02-01"), new Date("2021-05-01"),30))
				.addTask(new Graph.Task("Random Task 5", new Date("2021-01-31"), new Date("2021-03-01"),100))
				.addTask(new Graph.Task("Random Task 6", new Date("2021-05-01"), new Date("2021-05-05"),25))
				.addTask(new Graph.Task("Random Task 7", new Date("2021-12-01"), new Date("2022-04-01"),75))

				.addMilestone(new Graph.Milestone("Milestone 1", new Date("2020-12-01")))
				.addMilestone(new Graph.Milestone("Milestone 2", new Date()))
				.addMilestone(new Graph.Milestone("Milestone 3", new Date("2022-08-15")))
		}
	}

	export class Task {
		

		label: string
		dateStart: Date
		dateEnd: Date
		progress: number
		isShow: boolean
	
		constructor(label : string, dateStart : Date, dateEnd : Date, progress : number = 0, isShow = true) {
			this.label = label
			this.dateStart = dateStart
			this.dateEnd = dateEnd
			this.progress = progress
			this.isShow = isShow
		}

		join(car : string){
		
			return "task" + car 
			+ this.label + car 
			+ this.isShow + car 
			+ Helpers.toISODateString(this.dateStart) + car
			+ Helpers.toISODateString(this.dateEnd) + car 
			+ this.progress
		}

		clone(){
			return new Task(this.label, this.dateStart, this.dateEnd,this.progress, this.isShow)
		}
	}

	export class Milestone {
		label: string
		date: Date
		isShow: boolean
	
		constructor(label : string, date : Date, isShow = true) {
		this.label = label;
		this.date = date;
		this.isShow = isShow
		}

		join(car : string){
			return "milestone" + car 
				+ this.label + car 
				+ this.isShow + car 
				+ Helpers.toISODateString(this.date)
		}
		
		clone(){
			return new Milestone(this.label, this.date)
		}
	}
}