import { FactorySwimline } from "$lib/factorySwimline";
import { FactoryTimeline } from "$lib/factoryTimeline";
import { Struct, type abstractTimelineInterface } from "$lib/struct.class";



export function parseAbstractTimeline(newTimeline:Struct.Timeline, abstractTimeline:abstractTimelineInterface):Struct.Timeline{

    if(abstractTimeline.title){
        newTimeline.title = abstractTimeline['title']
    }

    if(abstractTimeline.version){
        //Nothing right now
    }
    if(abstractTimeline.tasks){
        
        let previousSwimline: string
        let previousSwimlineId: number

        abstractTimeline.tasks.forEach(abstractTask => {

            if(abstractTask.swimline !== "" && previousSwimline == abstractTask.swimline){
                //reuse id of previous swimline
            } else if(abstractTask.swimline !== "" && previousSwimline != abstractTask.swimline) {
                // create new swimline and save its id
                previousSwimlineId = FactorySwimline.create(newTimeline, abstractTask.swimline)
            } else {
                //reset previous Swimline id
                previousSwimlineId = -1
            }

            FactoryTimeline.addTask(newTimeline, 
                new Struct.Task(newTimeline.getNextId(), 
                                abstractTask.label, 
                                abstractTask.start, 
                                abstractTask.end, 
                                abstractTask.hasProgress === false?abstractTask.hasProgress:true,
                                abstractTask.progress, 
                                abstractTask.isShow === false?abstractTask.isShow:true, 
                                abstractTask.swimline, 
                                previousSwimlineId,
                            ))
            
            previousSwimline = abstractTask.swimline
        });
    }
    if(abstractTimeline['milestones']){
        abstractTimeline['milestones'].forEach(abstractMilestone => {
            FactoryTimeline.addMilestone(newTimeline, 
                new Struct.Milestone(newTimeline.getNextId(), 
                                    abstractMilestone.label, 
                                    abstractMilestone.date, 
                                    abstractMilestone.isShow === false?abstractMilestone.isShow:true, 
                                ))
        });
    }

    return newTimeline
}