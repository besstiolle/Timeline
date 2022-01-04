import { Helpers } from './helpers.class';
import { browser } from "$app/env";

export module Struct {

	export class Data {
		
		tasks : Array<Task> = new Array<Task>()
        milestones : Array<Milestone> = new Array<Milestone>()
		isInitiate : boolean = false
		start: Date
		end: Date
		maxId: number = 0

		constructor(){
		}

		addTask(task: Task) : Data{
			this.tasks.push(task)
			this.isInitiate = true
			this.reorderIds()
			return this
		}

		addMilestone(milestone: Milestone) : Data{
			this.milestones.push(milestone)
			this.isInitiate = true
			this.reorderIds()
			return this
		}

		purge() : void{
			this.tasks = new Array<Task>()
			this.milestones = new Array<Milestone>()
			this.isInitiate = false
		}

		processLimites() : Data{
			this.start = Helpers.getMin(this.tasks, this.milestones)
    		this.end = Helpers.getMax(this.tasks, this.milestones)

			//TODO prévoir le cas des années / périodes très longues / très courtes
			this.start.setDate(1)
			this.end.setDate(1)
			this.end.setMonth(this.end.getMonth() + 1)

			return this
		}

		getNextId() : number{
			return this.maxId + 1
		}

		reorderIds() : void{
			let id : number = 1
			let lenTasks: number = this.tasks.length
			let lenMilestones: number = this.milestones.length
			for(let i=0; i < lenTasks; i++){
				this.tasks[i].id = id
				this.maxId = id
				id++
			}
			for(let i=0; i < lenMilestones; i++){
				this.milestones[i].id = id
				this.maxId = id
				id++
			}
		}

		initiate() : Data{
			if(browser){
				let localData: Data = JSON.parse(localStorage.getItem("store"), Helpers.dataReviver)
									
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
				.addTask(new Struct.Task(0, "Random Task 0", new Date("2021-01-15"), new Date("2021-04-01"),100))
				.addTask(new Struct.Task(1, "Random Task 1", new Date("2021-12-01"), new Date("2022-04-01")))
				.addTask(new Struct.Task(2, "Random Task 2", new Date("2021-02-01"), new Date("2021-03-05"),15))
				.addTask(new Struct.Task(3, "Random Task 3", new Date("2021-03-10"), new Date("2021-03-30"),0))
				.addTask(new Struct.Task(4, "Random Task 4", new Date("2021-02-01"), new Date("2021-05-01"),30))
				.addTask(new Struct.Task(5, "Random Task 5", new Date("2021-01-31"), new Date("2021-03-01"),100))
				.addTask(new Struct.Task(6, "Random Task 6", new Date("2021-05-01"), new Date("2021-05-05"),25))
				.addTask(new Struct.Task(7, "Random Task 7", new Date("2021-12-01"), new Date("2022-04-01"),75))

				.addMilestone(new Struct.Milestone(8, "Milestone 1", new Date("2020-12-01")))
				.addMilestone(new Struct.Milestone(9, "Milestone 2", new Date()))
				.addMilestone(new Struct.Milestone(10, "Milestone 3", new Date("2022-08-15")))

				.processLimites()
		}
	}

	export class Task {
		id: number
		label: string
		dateStart: Date
		dateEnd: Date
		progress: number
		isShow: boolean
	
		constructor(id : number, label : string, dateStart : Date, dateEnd : Date, progress : number = 0, isShow = true) {
			this.id = id
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
			return new Task(-1, this.label, this.dateStart, this.dateEnd,this.progress, this.isShow)
		}
	}

	export class Milestone {
		id: number
		label: string
		date: Date
		isShow: boolean
	
		constructor(id : number, label : string, date : Date, isShow = true) {
			this.id = id
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
			return new Milestone(-1, this.label, this.date)
		}
	}
}