import { Helpers } from './helpers.class';
import { browser } from "$app/env";

export module Struct {

	export class Data {
		
		tasks : Array<Task> = new Array<Task>()
        milestones : Array<Milestone> = new Array<Milestone>()
		isInitiate : boolean = false
		start: Date
		end: Date

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

		processLimites() : Data{
			this.start = Helpers.getMin(this.tasks, this.milestones)
    		this.end = Helpers.getMax(this.tasks, this.milestones)

			//TODO prévoir le cas des années / périodes très longues / très courtes
			this.start.setDate(1)
			this.end.setDate(1)
			this.end.setMonth(this.end.getMonth() + 1)

			return this
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
				//Don't initiate data in SSR
				return this.processLimites()
			}
			
		}

		_initiate() : Data{
			return this
				.addTask(new Struct.Task("Random Task 0", new Date("2021-01-15"), new Date("2021-04-01"),100, true, ""))
				.addTask(new Struct.Task("Random Task 1", new Date("2021-12-01"), new Date("2022-04-01"),0, true,""))
				.addTask(new Struct.Task("Random Task 2", new Date("2021-02-01"), new Date("2021-03-05"),15, true,"Swimline1"))
				.addTask(new Struct.Task("Random Task 3", new Date("2021-03-10"), new Date("2021-03-30"),0, true,"Swimline1"))
				.addTask(new Struct.Task("Random Task 4", new Date("2021-02-01"), new Date("2021-05-01"),30, false, ""))
				.addTask(new Struct.Task("Random Task 5", new Date("2021-01-31"), new Date("2021-03-01"),100, true, ""))
				.addTask(new Struct.Task("Random Task 6", new Date("2021-05-01"), new Date("2021-05-05"),25, true,"Swimline2"))
				.addTask(new Struct.Task("Random Task 7", new Date("2021-12-01"), new Date("2022-04-01"),75, true, ""))

				.addMilestone(new Struct.Milestone("Milestone 1", new Date("2020-12-01"), true))
				.addMilestone(new Struct.Milestone("Milestone 2", new Date(), true))
				.addMilestone(new Struct.Milestone("Milestone 3", new Date("2022-08-15"), false))

				.processLimites()
		}
	}

	export class Task {
		

		label: string
		dateStart: Date
		dateEnd: Date
		progress: number
		isShow: boolean
		swimline: string
	
		constructor(label : string, dateStart : Date, dateEnd : Date, progress : number, isShow : boolean, swimline: string) {
			this.label = label
			this.dateStart = dateStart
			this.dateEnd = dateEnd
			this.progress = progress
			this.isShow = isShow
			this.swimline = swimline
		}

		join(car : string){
		
			return "task"
				+ car + this.label
				+ car + this.isShow
				+ car + Helpers.toISODateString(this.dateStart)
				+ car + Helpers.toISODateString(this.dateEnd)
				+ car + this.progress
				+ car + this.swimline
		}

		clone(){
			return new Task(this.label, this.dateStart, this.dateEnd,this.progress, this.isShow, this.swimline)
		}
	}

	export class Milestone {
		label: string
		date: Date
		isShow: boolean
	
		constructor(label : string, date : Date, isShow : boolean) {
		this.label = label;
		this.date = date;
		this.isShow = isShow
		}

		join(car : string){
			return "milestone"
				+ car + this.label
				+ car + this.isShow
				+ car + Helpers.toISODateString(this.date)
		}
		
		clone(){
			return new Milestone(this.label, this.date, this.isShow)
		}
	}

	
	export class TmpStructSwimline{
		id: number //The id of the first task
		label: string // the label of the swimline
		countVisibleTasks: number // Number of visible task
		
		constructor(id: number, label:string, ){
			this.id = id
			this.label = label
		}

		setCountVisibleTasks(countVisibleTasks:number){
			this.countVisibleTasks = countVisibleTasks
		}
	}
}