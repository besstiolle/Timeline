
import { Helpers } from "./helpers.class";
import type { Struct } from "./struct.class";

export module HelperStructMilestone {

    export function join(milestone: Struct.Milestone, car : string){
        return "milestone"
            + car + milestone.label
            + car + milestone.isShow
            + car + Helpers.toISODateString(milestone.date)
    }
    
  
    export function getById(data : Struct.Data, id : number) : Struct.Milestone{
        //A simple loop to reach for the good item because it's cheaper
        // than trying to maintain a map with id => index of array each time 
        // we change something into the $store
        let result:Struct.Milestone = null
        data.milestones.forEach(milestone => {
            if(milestone.id == id){
                result = milestone
            } 
        });
        if(result) {
            return result
        }
        
        throw "Struct.Milestone with id "+id+" was not found"       
    }
}
