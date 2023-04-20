import { Helpers } from "./helpers"
import { Rights } from "./rights.class"

export module Struct {

	export class TimelineStore {
		cards : Array<Card> = new Array<Card>()
		currentTimeline : Timeline = new Timeline('','')
		lastUpdatedLocally : number = -1
		lastCommitedRemotely : number = -1
		_cancelRefreshLastUpdatedLocally: boolean = false // Tricks : Set to true if we don't want to refresh lastUpdatedLocally property
		commitInProgress: boolean = false
		rights: Rights = new Rights(null)
	}

	export class Card {
		key : string 
		title : string
		lastUpdated : Date|null = null
		isOnline: boolean = false
		//Check jsonParser.ts > cardsReviver() function if you add something here.

		constructor(key : string, title : string){
			this.key = key
			this.title = title
			this.lastUpdated = new Date()
			this.isOnline = false
		}
	}

	export class Timeline {
		
		key : string
		title : string
		tasks : Array<Task> = new Array<Task>()
        milestones : Array<Milestone> = new Array<Milestone>()
		swimlines : Array<Swimline> = new Array<Swimline>()
		isInitiate : boolean = false
		start: string|null = null
		end: string|null = null
		differencial: string|null = null
		maxId: number = 0
		viewbox: string = "0 0 0 0"
		showAll: boolean = false
		isOnline: boolean = false
		ownerKey: string|null = null
		writeKey: string|null = null
		readKey: string|null = null
		showToday: boolean = true
		showOutOfBounds: boolean = true
		dateStartFocus: string|null = null
		dateEndFocus: string|null = null
		//Check jsonParser.ts > timelineReviver() function if you add something here.
		
		constructor(key:string, title:string){
			this.key = key	
			this.title = title
		}

		getNextId() : number{
			this.maxId++
			return this.maxId
		}

		getStart() : Date{
			if(this.start == null){return new Date()}
			return new Date(this.start)
		}

		getStartTime():number{
			if(this.start == null){return new Date().getTime()}
			return new Date(this.start).getTime()
		}

		getEnd() : Date{
			if(this.end == null){return new Date()}
			return new Date(this.end)
		}

		getEndTime():number{
			if(this.end == null){return new Date().getTime()}
			return new Date(this.end).getTime()
		}

		setStart(start: Date) : void{
			this.start = Helpers.toYYYY_MM_DD(start)
		}

		setEnd(end: Date) : void{
			this.end = Helpers.toYYYY_MM_DD(end)
		}

		getStartFocus() : Date|null{
			if(this.dateStartFocus == null){return null}
			return new Date(this.dateStartFocus)
		}

		getEndFocus() : Date|null{
			if(this.dateEndFocus == null){return null}
			return new Date(this.dateEndFocus)
		}

		setStartFocus(startFocus: Date) : void{
			this.dateStartFocus = Helpers.toYYYY_MM_DD(startFocus)
		}

		setEndFocus(endFocus: Date) : void{
			this.dateEndFocus = Helpers.toYYYY_MM_DD(endFocus)
		}
	}

	export class Task {
		id: number
		label: string
		dateStart: string
		dateEnd: string
		hasProgress:boolean
		progress: number
		isShow: boolean
		swimline: string
		swimlineId: number
	
		constructor(id : number, label : string, dateStart : string, dateEnd : string, hasProgress:boolean, progress : number, isShow : boolean, swimline:string, swimlineId: number) {
			this.id = id
			this.label = label
			this.dateStart = dateStart
			this.dateEnd = dateEnd
			this.hasProgress = hasProgress
			this.progress = progress
			this.isShow = isShow
			this.swimline = swimline
			this.swimlineId = swimlineId
		}

		getStart() : Date{
			return new Date(this.dateStart)
		}

		getEnd() : Date{
			return new Date(this.dateEnd)
		}

		setStart(start: Date) : void{
			this.dateStart = Helpers.toYYYY_MM_DD(start)
		}

		setEnd(end: Date) : void{
			this.dateEnd = Helpers.toYYYY_MM_DD(end)
		}

		
	}

	export class Milestone {
		id: number
		label: string
		date: string
		isShow: boolean
	
		constructor(id : number, label : string, date : string, isShow : boolean) {
			this.id = id
			this.label = label;
			this.date = date;
			this.isShow = isShow
		}
		
		getDate() : Date{
			return new Date(this.date)
		}

		setDate(date: Date) : void{
			this.date = Helpers.toYYYY_MM_DD(date)
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

/**
 * Allow a proper typing in ts 
 * TODELETE ?
 */
/*export interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}*/

export interface abstractTimelineInterface{
	title:string
	version:string
	tasks:abstratTaskInterface[]
	milestones:abstractMilestoneInterface[]
}
export interface abstratTaskInterface{
	swimline:string
	label:string
    start:string
    end:string
	progress:number
    hasProgress:boolean
    isShow:boolean
}
export interface abstractMilestoneInterface{
	label:string
	date:string
	isShow:boolean

}