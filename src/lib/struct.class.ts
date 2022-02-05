export module Struct {

	export class TimelineStore {
		cards : Array<Card> = new Array<Card>()
		currentTimeline : Timeline = null
	}

	export class Card {
		key : string = null 
		title : string = null
		lastUpdated : Date = null
		//Check jsonParser.ts > cardsReviver() function if you add something here.

		constructor(key : string, title : string){
			this.key = key
			this.title = title
			this.lastUpdated = new Date()
		}
	}

	export class Timeline {
		
		key : string = null
		title : string = null
		tasks : Array<Task> = new Array<Task>()
        milestones : Array<Milestone> = new Array<Milestone>()
		swimlines : Array<Swimline> = new Array<Swimline>()
		isInitiate : boolean = false
		start: Date = null
		end: Date = null
		maxId: number = 0
		viewbox: string = "0 0 0 0"
		showAll: boolean = false
		isOnline: boolean = false
		ownerKey: string = null
		writeKey: string = null
		readKey: string = null
		//Check jsonParser.ts > timelineReviver() function if you add something here.
		
		constructor(key:string, title:string){
			this.key = key	
			this.title = title
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