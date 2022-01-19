export module Struct {

	export class Data {
		
		tasks : Array<Task> = new Array<Task>()
        milestones : Array<Milestone> = new Array<Milestone>()
		swimlines : Map<number, Struct.Swimline> = new Map()
		isInitiate : boolean = false
		start: Date
		end: Date
		maxId: number = 0
		mapperIdIndex : Map<number, number> = new Map<number, number>()
		viewbox: string = "0 0 0 0"
		showAll: boolean = false
		error: any = null
		//Check helper.ts > dataReviver() function if you add something here.
		
		constructor(){
		}

		getNextId() : number{
			return this.maxId + 1
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
	
		constructor(id : number, label : string, dateStart : Date, dateEnd : Date, progress : number, isShow : boolean, swimline: string) {
			this.id = id
			this.label = label
			this.dateStart = dateStart
			this.dateEnd = dateEnd
			this.progress = progress
			this.isShow = isShow
			this.swimline = swimline
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
		id: number //The id of the first task
		label: string // the label of the swimline
		countVisibleTasks: number // Number of visible task
		countAllTasks: number // Number of visible task
		isShow: boolean // If we need to see this Swimline

		
		constructor(id: number, label:string){
			this.id = id
			this.label = label
		}

		setCountVisibleTasks(countVisibleTasks:number){
			this.countVisibleTasks = countVisibleTasks
		}

		setCountAllTasks(countVisibleTasks:number){
			this.countVisibleTasks = countVisibleTasks
		}

		setIsShow(isShow:boolean){
			this.isShow = isShow
		}
	}
}