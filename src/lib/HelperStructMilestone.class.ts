
import { Helpers } from "./helpers.class";
import type { Struct } from "./struct.class";

export module HelperStructMilestone {

    export function join(milestone: Struct.Milestone, car : string){
        return "milestone"
            + car + milestone.label
            + car + milestone.isShow
            + car + Helpers.toISODateString(milestone.date)
    }
    
  
}