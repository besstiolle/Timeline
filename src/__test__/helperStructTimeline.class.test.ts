
import { HelperStructTimeline } from "$lib/helperStructTimeline.class";
import { Struct } from "$lib/struct.class";

jest.mock('$app/env', () => ({
    default: {
        browser: true,
      },
  }))


function testGetMin(){

    let timeline1 = new Struct.Timeline("key", "title")
    let timeline2 = new Struct.Timeline("key", "title")

    let date1: Date = new Date("2020-01-01")
    let date2: Date = new Date("2021-12-31")
    let date3: Date = new Date("2019-12-31")
    let date4: Date = new Date("2021-02-15")
    let date5: Date = new Date("2000-01-00")
    let date6: Date = new Date("2018-02-15")
    
    timeline1.tasks.push(new Struct.Task(1,"label 1", date1, date4, 100, true, "Swimline 1", 5))
    timeline1.tasks.push(new Struct.Task(2,"label 2", date2, date1, 100, true, "Swimline 1", 5))
    timeline1.tasks.push(new Struct.Task(3,"label 3", date3, date2, 100, true, "Swimline 1", 5))
    timeline1.tasks.push(new Struct.Task(4,"label 4", date4, date5, 100, true, "Swimline 1", 5))

    
    timeline1.milestones.push(new Struct.Milestone(1,"label 1",date2, true))
    timeline1.milestones.push(new Struct.Milestone(2,"label 2",date2, true))
    timeline1.milestones.push(new Struct.Milestone(3,"label 3",date2, true))
    timeline1.milestones.push(new Struct.Milestone(4,"label 4",date2, true))

    test("Helpers.getMin with minimal value in task.end and task.start", ()=> {
        expect(HelperStructTimeline.getMin(timeline1)).toEqual(date3)
    })
    
    
    timeline2.tasks.push(new Struct.Task(1,"label 1", date1, date4, 100, true, "Swimline 1", 5))
    timeline2.tasks.push(new Struct.Task(2,"label 2", date2, date1, 100, true, "Swimline 1", 5))
    timeline2.tasks.push(new Struct.Task(3,"label 3", date3, date2, 100, true, "Swimline 1", 5))
    timeline2.tasks.push(new Struct.Task(4,"label 4", date4, date5, 100, true, "Swimline 1", 5))

    
    timeline2.milestones.push(new Struct.Milestone(1,"label 1",date2, true))
    timeline2.milestones.push(new Struct.Milestone(2,"label 2",date2, true))
    timeline2.milestones.push(new Struct.Milestone(3,"label 3",date2, true))
    timeline2.milestones.push(new Struct.Milestone(4,"label 4",date2, true))
    timeline2.milestones.push(new Struct.Milestone(5,"label 5",date6, true))

    test("Helpers.getMin with minimal value in milestone", ()=> {
        expect(HelperStructTimeline.getMin(timeline2)).toEqual(date6)
    })
}
testGetMin()

function testGetMax(){

    let timeline1 = new Struct.Timeline("key", "title")
    let timeline2 = new Struct.Timeline("key", "title")

    let date1: Date = new Date("2020-01-01")
    let date2: Date = new Date("2021-12-31")
    let date3: Date = new Date("2019-12-31")
    let date4: Date = new Date("2021-02-15")
    let date5: Date = new Date("2000-01-00")
    let date6: Date = new Date("2030-02-15")
    
    timeline1.tasks.push(new Struct.Task(1,"label 1", date1, date4, 100, true, "Swimline 1", 5))
    timeline1.tasks.push(new Struct.Task(2,"label 2", date6, date1, 100, true, "Swimline 1", 5))
    timeline1.tasks.push(new Struct.Task(3,"label 3", date3, date2, 100, true, "Swimline 1", 5))
    timeline1.tasks.push(new Struct.Task(4,"label 4", date4, date5, 100, true, "Swimline 1", 5))

    
    timeline1.milestones.push(new Struct.Milestone(1,"label 1",date4, true))
    timeline1.milestones.push(new Struct.Milestone(2,"label 2",date4, true))
    timeline1.milestones.push(new Struct.Milestone(3,"label 3",date4, true))
    timeline1.milestones.push(new Struct.Milestone(4,"label 4",date4, true))

    test("Helpers.getMax with maximal value in task.end and task.start", ()=> {
        expect(HelperStructTimeline.getMax(timeline1)).toEqual(date2)
    })
    
    
    timeline2.tasks.push(new Struct.Task(1,"label 1", date1, date4, 100, true, "Swimline 1", 5))
    timeline2.tasks.push(new Struct.Task(2,"label 2", date6, date1, 100, true, "Swimline 1", 5))
    timeline2.tasks.push(new Struct.Task(3,"label 3", date3, date4, 100, true, "Swimline 1", 5))
    timeline2.tasks.push(new Struct.Task(4,"label 4", date4, date5, 100, true, "Swimline 1", 5))

    
    timeline2.milestones.push(new Struct.Milestone(1,"label 1",date4, true))
    timeline2.milestones.push(new Struct.Milestone(2,"label 2",date4, true))
    timeline2.milestones.push(new Struct.Milestone(3,"label 3",date4, true))
    timeline2.milestones.push(new Struct.Milestone(4,"label 4",date4, true))
    timeline2.milestones.push(new Struct.Milestone(5,"label 5",date2, true))

    test("Helpers.getMax with maximal value in milestone", ()=> {
        expect(HelperStructTimeline.getMax(timeline2)).toEqual(date2)
    })
}
testGetMax()

function testAddTask(){
    let timeline = new Struct.Timeline("key", "title")
    let date1: Date = new Date("2020-01-01")
    let date2: Date = new Date("2021-12-31")

    HelperStructTimeline.addTask(timeline, new Struct.Task(1,"label 1", date1, date2, 100, true, "Swimline 1", 5))
    HelperStructTimeline.addTask(timeline, new Struct.Task(2,"label 2", date1, date2, 100, true, "Swimline 1", 5))
    HelperStructTimeline.addTask(timeline, new Struct.Task(3,"label 3", date1, date2, 100, true, "Swimline 1", 5))

    test("Helpers.addTask with nominal value", ()=> {
        expect(timeline.tasks.length).toBe(3)
        expect(timeline.isInitiate).toBe(true)
    })
}
testAddTask()

function testAddMilestone(){
    let timeline = new Struct.Timeline("key", "title")
    let date1: Date = new Date("2020-01-01")

    HelperStructTimeline.addMilestone(timeline, new Struct.Milestone(1,"label 1",date1, true))
    HelperStructTimeline.addMilestone(timeline, new Struct.Milestone(2,"label 2",date1, true))
    HelperStructTimeline.addMilestone(timeline, new Struct.Milestone(3,"label 3",date1, true))

    test("Helpers.addMilestone with nominal value", ()=> {
        expect(timeline.milestones.length).toBe(3)
        expect(timeline.isInitiate).toBe(true)
    })

}
testAddMilestone()


function testPurge(){
    let timeline = new Struct.Timeline("key", "title")
    timeline.showAll = true
    let timelinePurged = new Struct.Timeline("key", "title")
    timelinePurged.showAll = true

    let date: Date = new Date("2020-01-01")

    timeline.tasks.push(new Struct.Task(1,"label 1", date, date, 100, true, "Swimline 1", 5))
    timeline.milestones.push(new Struct.Milestone(1,"label 1", date, true))
    timeline.swimlines.push(new Struct.Swimline("label"))
    timeline.isInitiate = true
    timeline.end = date
    timeline.start = date
    timeline.maxId = 99
    timeline.viewbox = "viewbox Value"

    HelperStructTimeline.purge(timeline)

    test("Helpers.purge with complete timeline", ()=> {
        expect(timeline.showAll).toEqual(timelinePurged.showAll)
        expect(timeline).toEqual(timelinePurged)
    })
}
testPurge()

