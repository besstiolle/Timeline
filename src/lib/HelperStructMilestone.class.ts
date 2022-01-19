
import { Helpers } from "./helpers.class";
import { Struct } from "./struct.class";

export module HelperStructMilestone {


    export function join(milestone: Struct.Milestone, car : string){
        return "milestone"
            + car + milestone.label
            + car + milestone.isShow
            + car + Helpers.toISODateString(milestone.date)
    }
    
    export function clone(milestone: Struct.Milestone, ){
        return new Struct.Milestone(-1, milestone.label, milestone.date, milestone.isShow)
    }
  
}