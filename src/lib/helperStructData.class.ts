
import { browser } from "$app/env";
import { Constantes } from "./constantes.class";
import { Helpers } from "./helpers.class";
import { Struct } from "./struct.class";

export module HelperStructData {

    /**
     * Return the min date of all tasks & all minestones.
     *   If there is no tasks/milestones it return the date of the system
     * @param data the <Struct.Data> to investigate
     * @returns <Date> the min date of milestones & tasks of the date of the system
     */
	export function getMin(data : Struct.Data): Date{
        if(data.tasks.length === 0 && data.milestones.length === 0){
            return new Date()
        }
        
        let min : Date = new Date("2999-12-31");
        data.tasks.forEach(task => {
            if(min > task.dateStart){
                min = task.dateStart
            }
        });
        data.milestones.forEach(milestone => {
            if(min > milestone.date){
                min = milestone.date
            }
        });
        
        return new Date(min)
    }

    /**
     * Return the max date of all tasks & all minestones.
     *   If there is no tasks/milestones it return the date of the system
     * @param data the <Struct.Data> to investigate
     * @returns <Date> the max date of milestones & tasks of the date of the system
     */
    export function getMax(data : Struct.Data): Date{
        
        if(data.tasks.length === 0 && data.milestones.length === 0){
            return new Date()
        }

        let max : Date = new Date("1900-01-01");
        data.tasks.forEach(task => {
            if(max < task.dateEnd){
                max = task.dateEnd
            }
        });
        data.milestones.forEach(milestone => {
            if(max < milestone.date){
                max = milestone.date
            }
        });
        return new Date(max)
    }   

    /**
     * Add a <Struct.Task> into the <Struct.Data>
     *   Refresh the limits / other compiled data
     * @param data the <Struct.Data> to investigate
     * @param task the <Struct.Task> to add
     * @returns <Struct.Data> the min date of milestones & tasks of the date of the system
     */
	export function addTask(data : Struct.Data, task: Struct.Task) : void{
        data.tasks.push(task)
        data.isInitiate = true
    }

    export function addMilestone(data : Struct.Data,milestone: Struct.Milestone) : void{
        data.milestones.push(milestone)
        data.isInitiate = true
    }

    export function purge(data : Struct.Data) : void{
        data.tasks = new Array<Struct.Task>()
        data.milestones = new Array<Struct.Milestone>()
        data.mapperIdIndex = new Map<number, number>()
        data.isInitiate = false
    }

    export function getTasksById(data : Struct.Data, id : number) : Struct.Task{
        //TODO secure code with verification of type returned
        if(data.mapperIdIndex.has(id)) {
            return data.tasks[data.mapperIdIndex.get(id)]
        }
        throw `Identifiant ${id} for Struct.Task doesn't exist in mapperIdIndex`
    }

    export function getMilestonesById(data : Struct.Data, id : number) : Struct.Milestone{
        //TODO secure code with verification of type returned
        if(data.mapperIdIndex.has(id)) {
            return data.milestones[data.mapperIdIndex.get(id)]
        }
        throw `Identifiant ${id} for Struct.Milestone doesn't exist in mapperIdIndex`
    }

    export function refresh(data : Struct.Data) : void{
        let start = new Date()
        console.info("refresh")
        _refreshMilestones(data)
        _processLimites(data)
        console.info("end refresh in %o ms", (new Date()).getMilliseconds() - start.getMilliseconds())
    }

    function _refreshMilestones(data : Struct.Data) : void{

        let task: Struct.Task;
        let comboVisible: number = 0
        let comboAll: number = 0
        let swimline: Struct.Swimline
        data.swimlines = new Map()
    
        let len: number = data.tasks.length
    
        for(let i: number=0; i < len; i++){
            task = data.tasks[i]
            //console.info("start with task " + i)
            
            //No swimline on current task
            if(!task.swimline || task.swimline ===""){
                //If a swimline was already open : close it
                if(swimline){
                    //Set combo in array/map/struct
                    swimline.setCountVisibleTasks(comboVisible)
                    swimline.setCountAllTasks(comboAll)
                    swimline.setIsShow(comboVisible == 0)
                    data.swimlines.set(swimline.id, swimline)
    
                    //console.info("closing swimline " + tmpStructSwimline.label + " with " + tmpStructSwimline.countVisibleTasks + " tasks inside (A)")
                    swimline = null
                    //Reset combo
                    comboVisible = 0
                    comboAll = 0
                }
                continue
            }
    
            //Increase combo if data tasks have same swimline than previous tasks
            if(swimline && swimline.label === task.swimline){
                comboAll++
                if(task.isShow){
                    comboVisible++
                }
                //console.info("increase swimline " + tmpStructSwimline.label + " with 1 more task inside (currently : " + tmpStructSwimline.countVisibleTasks + " )")
                
            //If there is no swimline open or no a similare swimline open : create a new one 
            } else if(!swimline || swimline.label !== task.swimline){
    
                // if a different swimline is already open
                if(swimline && swimline.label !== task.swimline){
                    //Set combo in array/map/struct
                    swimline.setCountVisibleTasks(comboVisible)
                    swimline.setCountAllTasks(comboAll)
                    swimline.setIsShow(comboVisible == 0)
                    data.swimlines.set(swimline.id, swimline)
    
                   // console.info("closing swimline " + tmpStructSwimline.label + " with " + tmpStructSwimline.countVisibleTasks + " tasks inside (B)")
                    swimline = null
                    //Reset combo
                    comboVisible = 0
                    comboAll = 0
                }   
                comboAll++
                if(task.isShow){
                    comboVisible++
                }
                swimline = new Struct.Swimline(i, task.swimline)
                //console.info("starting swimline " + tmpStructSwimline.label)
            }    
        }
    
        //Last line : Set combo in array/map/struct
        if(swimline){
            swimline.setCountVisibleTasks(comboVisible)
            swimline.setCountAllTasks(comboAll)
            swimline.setIsShow(comboVisible == 0)
            data.swimlines.set(swimline.id, swimline)
            //console.info("closing swimline " + tmpStructSwimline.label + " with " + tmpStructSwimline.countVisibleTasks + " tasks inside (C)")
        }
    }

    function _processLimites(data : Struct.Data) : void{
        //TODO :  calcul with / without hidden data ?
        data.start = HelperStructData.getMin(data)
        data.end =  HelperStructData.getMax(data)

        //TODO prévoir le cas des années / périodes très longues / très courtes
        data.start.setDate(1)
        data.end.setDate(1)
        data.end.setMonth(data.end.getMonth() + 1)

        //Reprocess viewbox sizing
        let len = data.tasks.length
        if(!data.showAll){
           len = Helpers.countVisibleTasksInList(data.tasks)
        }  
        data.viewbox = `0 0 ${Constantes.GRID.ALL_WIDTH} ${Constantes.GRID.MILESTONE_H + Constantes.GRID.ANNUAL_H + Constantes.GRID.ONE_TASK_H * len + Constantes.GRID.TODAY_H}`
        
    }

    export function initiate(data : Struct.Data) : Struct.Data{
        if(browser){
            let localData: Struct.Data = JSON.parse(localStorage.getItem("store"), Helpers.dataReviver)
                                
            if(localData && localData.isInitiate){
                data = localData
            }  else {
                addTask(data, new Struct.Task(0, "Random Task 0", new Date("2021-01-15"), new Date("2021-04-01"),100, true, ""))
                addTask(data, new Struct.Task(1, "Random Task 1", new Date("2021-12-01"), new Date("2022-04-01"),0, true,""))
                addTask(data, new Struct.Task(2, "Random Task 2", new Date("2021-02-01"), new Date("2021-03-05"),15, true,"Swimline1"))
                addTask(data, new Struct.Task(3, "Random Task 3", new Date("2021-03-10"), new Date("2021-03-30"),0, true,"Swimline1"))
                addTask(data, new Struct.Task(4, "Random Task 4", new Date("2021-02-01"), new Date("2021-05-01"),30, false, ""))
                addTask(data, new Struct.Task(5, "Random Task 5", new Date("2021-01-31"), new Date("2021-03-01"),100, true, ""))
                addTask(data, new Struct.Task(6, "Random Task 6", new Date("2021-05-01"), new Date("2021-05-05"),25, true,"Swimline2"))
                addTask(data, new Struct.Task(7, "Random Task 7", new Date("2021-12-01"), new Date("2022-04-01"),75, true, ""))
        
                addMilestone(data, new Struct.Milestone(8, "Milestone 1", new Date("2020-12-01"), true))
                addMilestone(data, new Struct.Milestone(9, "Milestone 2", new Date(), true))
                addMilestone(data, new Struct.Milestone(10, "Milestone 3", new Date("2022-08-15"), false))

                data.maxId=11
            }            
        }
        //refresh(data)
        return data   
    }
}