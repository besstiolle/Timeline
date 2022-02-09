import { Struct } from "./struct.class";

export module JsonParser {


    /**
     * Reviver used for JSON.parse(Struct.Timeline)
     * @param key the key for reviver
     * @param value the value for reviver
     * @returns the same value of the value processed
     */
	export function timelineReviver(key : string, value : any) {
        
        const COMMONS: string[] = ['isInitiate', 'maxId', 'viewbox', 'showAll', // Primitive type field of Timeline
                                 'position','isShow','label', 'id', 'swimline', 'progress',
                                 'swimlineId', 'countVisibleTasks', 'countAllTasks',
                                 'key', 'title',
                                 'isOnline', 'ownerKey', 'writeKey', 'readKey', 
                                 'tasks', 'milestones', 'swimlines', //Nothing to do, it's an array
                                 'date', 'dateStart', 'dateEnd', // date inside object, will be cast by new Date when reviver the object
                                ]
        if(COMMONS.includes(key)){
            return value
        }

        //Case of object Timeline
        if(key === ''){
            let structTimeline: Struct.Timeline = Object.assign(new Struct.Timeline(value.key, value.title), value)
            return structTimeline
        }

        //Case of Date (min, max, ...)
        //TODO rewrite code
        if(['start', 'end'].includes(key)) {
            if(value == null) {
                return null
            }
            return value
		}

        if(typeof value === 'object' && value !== null && value.label) { //Un object contenant un label => nos objects Task & Milestone
            if(value.date){
                // Because of Date we can't do 
                //  > Object.assign(new Struct.Task, value) 
                //TODO rewrite code
                return new Struct.Milestone(value.id, value.label,value.date, value.isShow)
            } else if (value.dateStart) {
                // Because of Date we can't do 
                //  > Object.assign(new Struct.Task, value) 
                //TODO rewrite code
                return new Struct.Task(value.id, value.label,value.dateStart, value.dateEnd, 
                                value.progress, value.isShow, value.swimline, value.swimlineId)
            } else {
                //This is a re-processed value, we don't need to reprocessing it right now
                return value
            }
        }

        //We need to test this in last position to be sur to catch object in map & array 
        if(/^\d+$/.exec(key)){
            return value
        }


        if(value == null){
            console.info("value was null for key `%o` in JsonReviver.timelineReviver() function", key)
            return value
        }
        
        //console.warn("key : `%o` with value `%o` was not caught in JsonReviver.timelineReviver() function" , key, value)
        //return value
        throw "key : `"+key+"` with value `"+value+"` was not caught in JsonReviver.timelineReviver() function"
	}

    /**
     * Reviver used for JSON.parse(Struct.Cards)
     * @param key the key for reviver
     * @param value the value for reviver
     * @returns the same value of the value processed
     */
	export function cardsReviver(key : string, value : any) {
        
        const COMMONS: string[] = ['key', 'title', // Primitive type field of Timeline
        
                                   //'xxx' , //Nothing to do, it's an array
                                 //'', // date inside object, will be cast by new Date when reviver the object
                                ]
        if(COMMONS.includes(key)){
            return value
        }

        //Case of array Array<Card>
        if(key === ''){
            return value
        }

        //Case of Date (lastUpdated, ...)
        if(['lastUpdated'].includes(key)) {
            if(value == null) {
                return null
            }
            return new Date(value)
		}

        if(typeof value === 'object' && value !== null && value.key) { //Un object contenant un key => notre object Card
                // Because of Date we can't do 
                //  > Object.assign(new Struct.Card, value) 
                let structCard: Struct.Card = Object.assign(new Struct.Card(value.key, value.title), value)
                return structCard   
        }

        //We need to test this in last position to be sur to catch object in map & array 
        if(/^\d+$/.exec(key)){
            return value
        }


        if(value == null){
            console.info("value was null for key `%o` in JsonReviver.cardsReviver() function", key)
            return value
        }
        
        console.warn("key : `%o` with value `%o` was not caught in JsonReviver.cardsReviver() function" , key, value)

		return value;
	}

}