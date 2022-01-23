export module Struct {

	export class Data {
		
		tasks : Array<Task> = new Array<Task>()
        milestones : Array<Milestone> = new Array<Milestone>()
		swimlines : Array<Swimline> = new Array<Swimline>()
		isInitiate : boolean = false
		start: Date = null
		end: Date = null
		maxId: number = 0
		viewbox: string = "0 0 0 0"
		showAll: boolean = false
		//Check helper.ts > dataReviver() function if you add something here.
		
		constructor(){
		}

		getNextId() : number{
			this.maxId++
			return this.maxId
		}
	}

	export class Task {
		id: number
		label: string
		dateStart: Date
		dateEnd: Date
		progress: number
		isShow: boolean
		swimline: string
		swimlineId: number
	
		constructor(id : number, label : string, dateStart : Date, dateEnd : Date, progress : number, isShow : boolean, swimline:string, swimlineId: number) {
			this.id = id
			this.label = label
			this.dateStart = dateStart
			this.dateEnd = dateEnd
			this.progress = progress
			this.isShow = isShow
			this.swimline = swimline
			this.swimlineId = swimlineId
		}

		
	}

	export class Milestone {
		id: number
		label: string
		date: Date
		isShow: boolean
	
		constructor(id : number, label : string, date : Date, isShow : boolean) {
			this.id = id
			this.label = label;
			this.date = date;
			this.isShow = isShow
		}
	}

	
	export class Swimline{
		label: string // the label of the swimline
		countVisibleTasks: number // Number of visible task
		countAllTasks: number // Number of visible task
		isShow: boolean // If we need to see this Swimline

		
		constructor(label:string){
			this.label = label
			this.countVisibleTasks = 0
			this.countAllTasks = 0
			this.isShow = true
		}
	}
}