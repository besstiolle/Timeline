
import { Helpers } from "./helpers.class";
import type { Struct } from "./struct.class";

export module HelperStructMilestone {

    /**
     * return the values of the Milestone concatenated for CSV with a custom separator
     * @param milestone the Milestone
     * @param car the separator
     * @returns a string with values concatenated for CSV
     */
    export function join(milestone: Struct.Milestone, car : string){
        return "milestone"
            + car + milestone.label
            + car + milestone.isShow
            + car + Helpers.toISODateString(milestone.date)
    }
    
    /**
     * Return the Milestone given by its own id
     * @param data the Struct.Data to look inside
     * @param id the id of the Milestone
     * @returns the Milestone found or an exception
     */
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
        
        //TODO : better thtow a real exception
        throw "Struct.Milestone with id "+id+" was not found"       
    }
}
