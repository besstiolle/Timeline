
import { browser } from "$app/environment"
import { Helpers } from "./helpers"
import { FactorySwimline } from "./factorySwimline";
import { Milestone, Swimline, Task, Timeline } from "./struct.class";
import { DIFF, GRID } from "./constantes";
import { DuplicateEntityException } from "./timelineException.class";

export class FactoryTimeline {

    /**
     * Return the min date of all tasks & all minestones.
     *   If there is no tasks/milestones it return the date of the system
     * @param timeline the Timeline to investigate
     * @returns <Date> the min date of milestones & tasks in the Timeline 
     */
	static getMin(timeline : Timeline): Date{
        if(timeline.tasks.length === 0 && timeline.milestones.length === 0){
            return new Date()
        }
        
        let min : Date = new Date("2999-12-31");
        timeline.tasks.forEach(task => {
            if((timeline.showAll || task.isShow) && min > task.getStart()){
                min = task.getStart()
            }
        });
        timeline.milestones.forEach(milestone => {
            if((timeline.showAll || milestone.isShow) && min > milestone.getDate()){
                min = milestone.getDate()
            }
        });
        
        return min
    }
    

    /**
     * Return the max date of all tasks & all minestones.
     *   If there is no tasks/milestones it return the date of the system
     * @param timeline the Timeline to investigate
     * @returns <Date> the max date of milestones & tasks in the Timeline
     */
    static getMax(timeline : Timeline): Date{
        
        if(timeline.tasks.length === 0 && timeline.milestones.length === 0){
            return new Date()
        }

        let max : Date = new Date("1900-01-01");
        timeline.tasks.forEach(task => {
            if((timeline.showAll || task.isShow) && max < task.getEnd()){
                max = task.getEnd()
            }
        });
        timeline.milestones.forEach(milestone => {
            if((timeline.showAll || milestone.isShow) && max < milestone.getDate()){
                max = milestone.getDate()
            }
        });
        return max
    }   

    /**
     * Add a Task into the Timeline
     * @param timeline the Timeline to investigate
     * @param task the Task to add
     */
	static addTask(timeline : Timeline, task: Task) : void{
        timeline.tasks.forEach(element => {
            if(element.id === task.id){
                throw new DuplicateEntityException('Task', task.id)
            }
        });
        
        timeline.tasks.push(task)
        timeline.isInitiate = true
    }

    /**
     * Add a Milestone into the Timeline
     * @param timeline the Milestone to investigate
     * @param milestone the Milestone to add
     */
    static addMilestone(timeline : Timeline,milestone: Milestone) : void{
        timeline.milestones.forEach(element => {
            if(element.id === milestone.id){
                throw new DuplicateEntityException('Milestone', milestone.id)
            }
        });
        
        timeline.milestones.push(milestone)
        timeline.isInitiate = true
    }

    /**
     * Remove all data from the Milestone excepted the user choices like "showAll" options
     * @param timeline the Milestone to purge
     */
    static purge(timeline : Timeline) : void{
        timeline.tasks = new Array<Task>()
        timeline.milestones = new Array<Milestone>()
        timeline.swimlines = new Array<Swimline>()
        timeline.isInitiate = false
		timeline.start = null
		timeline.end = null
        timeline.differencial = null
		timeline.maxId = 0
		timeline.viewbox = "0 0 0 0"
		//timeline.showAll = false //Don't reset this parameter
		//timeline.isOnline = false //Don't reset this parameter
		//timeline.ownerKey = null //Don't reset this parameter
		//timeline.writeKey = null //Don't reset this parameter
        //timeline.readKey = null //Don't reset this parameter
        //timeline.key = null //Don't reset this parameter
    }

    static refresh(timeline : Timeline) : void{
        this._refreshSwimlines(timeline)
        this._processLimites(timeline)
        this._processViewboxResizing(timeline)
    }

    protected static _refreshSwimlines(timeline : Timeline) : void{
        timeline.swimlines = new Array<Swimline>()
        
        let swimlineLabel: string
        let previousSwimlineLabel = ''
        let previousSwimlineId = -1
    
        //Initiate each swimline
        for(let i: number=0; i < timeline.tasks.length; i++){
            swimlineLabel = timeline.tasks[i].swimline
            if(swimlineLabel !== "" && previousSwimlineLabel == swimlineLabel){
                //reuse id of previous swimline
            } else if(swimlineLabel !== "" && previousSwimlineLabel != swimlineLabel) {
                // create new swimline and save its id
                previousSwimlineId = FactorySwimline.create(timeline,swimlineLabel)
            } else {
                //reset previous Swimline id
                previousSwimlineId = -1
            }
            timeline.tasks[i].swimlineId = previousSwimlineId
            previousSwimlineLabel = swimlineLabel
        }
        //update swimlines count of visibles / invisibles tasks
        for(let i: number=0; i < timeline.tasks.length; i++){
            if(timeline.tasks[i].swimlineId != -1){
                timeline.swimlines[timeline.tasks[i].swimlineId].countAllTasks++
                if(timeline.tasks[i].isShow){
                    timeline.swimlines[timeline.tasks[i].swimlineId].countVisibleTasks++
                }
            }
        }
        //update swimlines isShow to false if there is no shown task
        for(let i: number=0; i < timeline.swimlines.length; i++){
            if(timeline.swimlines[i].countVisibleTasks == 0){
                timeline.swimlines[i].isShow = false
            }
        }
    }

    protected static _processLimites(timeline : Timeline) : void{
        const start = FactoryTimeline.getMin(timeline)
        const end = FactoryTimeline.getMax(timeline)

        timeline.differencial = Helpers.getEstimationOfDiff(start, end)

        switch (timeline.differencial){
            case DIFF.isMoreThan20Years: 
            case DIFF.isBetween10YearsAnd20Years: 
                start.setFullYear(start.getFullYear() - 1)
                end.setFullYear(end.getFullYear() + 1)
                start.setDate(1)
                end.setDate(1)
                break
            case DIFF.isBetween6YearsAnd10Years:
            case DIFF.isBetween3YearsAnd6Years:
            case DIFF.isBetween20MonthsAnd3Years:
            case DIFF.isBetween5MonthsAnd20Months:
                if(start.getDate()<15){
                    start.setMonth(start.getMonth() - 1)
                }
                if(end.getDate()>15){
                    end.setMonth(end.getMonth() + 2)
                } else {
                    end.setMonth(end.getMonth() + 1)
                }
                start.setDate(1)
                end.setDate(1)
                break
            case DIFF.isBetween1MonthAnd5Months:
                start.setDate(start.getDate() - 5)
                end.setDate(end.getDate() + 5)
                break
            case DIFF.isBelow1Month:
                start.setDate(start.getDate() - 2)
                end.setDate(end.getDate() + 2)
                break
        }

        timeline.setStart(start)
        timeline.setEnd(end)
    }

    protected static _processViewboxResizing(timeline: Timeline) : void{
        //Reprocess viewbox sizing
        let len = timeline.tasks.length
        if(!timeline.showAll){
           len = Helpers.countVisibleTasksInList(timeline.tasks)
        }  
        timeline.viewbox = `0 0 ${GRID.ALL_WIDTH} ${GRID.MILESTONE_H + GRID.ANNUAL_H + GRID.ONE_TASK_H * len + GRID.TODAY_H}`
        
    }

    static initiate(timeline : Timeline) : Timeline{
        if(browser){
            
            const swim1Id = FactorySwimline.create(timeline,"Swimline1")
            const swim2Id = FactorySwimline.create(timeline,"Swimline2")

            this.addTask(timeline, new Task(0, "Random Task 0", "2021-01-15", "2021-04-01", true, 100, true, "", -1))
            this.addTask(timeline, new Task(1, "Random Task 1", "2021-12-01", "2022-04-01", false, 0, true, "", -1))
            this.addTask(timeline, new Task(2, "Random Task 2", "2021-02-01", "2021-03-05", true, 15, true, "Swimline1", swim1Id))
            this.addTask(timeline, new Task(3, "Random Task 3", "2021-03-10", "2021-03-30", true, 0, true, "Swimline1", swim1Id))
            this.addTask(timeline, new Task(4, "Random Task 4", "2021-02-01", "2021-05-01", true, 30, false, "", -1))
            this.addTask(timeline, new Task(5, "Random Task 5", "2021-01-31", "2021-03-01", true, 100, true, "", -1))
            this.addTask(timeline, new Task(6, "Random Task 6", "2021-05-01", "2021-05-05", true, 25, true, "Swimline2", swim2Id))
            this.addTask(timeline, new Task(7, "Random Task 7", "2021-12-01", "2022-04-01", true, 75, true, "", -1))
    
            this.addMilestone(timeline, new Milestone(8, "Milestone 1", "2020-12-01", true))
            this.addMilestone(timeline, new Milestone(9, "Milestone 2", "2021-03-20", true))
            this.addMilestone(timeline, new Milestone(10, "Milestone 3", "2022-08-15", false))

            timeline.maxId=11     
        }
        return timeline   
    }
}