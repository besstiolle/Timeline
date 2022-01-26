
import { HelperStructTimeline } from "$lib/helperStructTimeline.class";
import { Struct } from "$lib/struct.class";

jest.mock('$app/env', () => ({
    default: {
        browser: true,
      },
  }))


function testGetMin(){

    let data1 = new Struct.Timeline("key", "title")
    let data2 = new Struct.Timeline("key", "title")

    let date1: Date = new Date("2020-01-01")
    let date2: Date = new Date("2021-12-31")
    let date3: Date = new Date("2019-12-31")
    let date4: Date = new Date("2021-02-15")
    let date5: Date = new Date("2000-01-00")
    let date6: Date = new Date("2018-02-15")
    
    data1.tasks.push(new Struct.Task(1,"label 1", date1, date4, 100, true, "Swimline 1", 5))
    data1.tasks.push(new Struct.Task(2,"label 2", date2, date1, 100, true, "Swimline 1", 5))
    data1.tasks.push(new Struct.Task(3,"label 3", date3, date2, 100, true, "Swimline 1", 5))
    data1.tasks.push(new Struct.Task(4,"label 4", date4, date5, 100, true, "Swimline 1", 5))

    
    data1.milestones.push(new Struct.Milestone(1,"label 1",date2, true))
    data1.milestones.push(new Struct.Milestone(2,"label 2",date2, true))
    data1.milestones.push(new Struct.Milestone(3,"label 3",date2, true))
    data1.milestones.push(new Struct.Milestone(4,"label 4",date2, true))

    test("Helpers.getMin with minimal value in task.end and task.start", ()=> {
        expect(HelperStructTimeline.getMin(data1)).toEqual(date3)
    })
    
    
    data2.tasks.push(new Struct.Task(1,"label 1", date1, date4, 100, true, "Swimline 1", 5))
    data2.tasks.push(new Struct.Task(2,"label 2", date2, date1, 100, true, "Swimline 1", 5))
    data2.tasks.push(new Struct.Task(3,"label 3", date3, date2, 100, true, "Swimline 1", 5))
    data2.tasks.push(new Struct.Task(4,"label 4", date4, date5, 100, true, "Swimline 1", 5))

    
    data2.milestones.push(new Struct.Milestone(1,"label 1",date2, true))
    data2.milestones.push(new Struct.Milestone(2,"label 2",date2, true))
    data2.milestones.push(new Struct.Milestone(3,"label 3",date2, true))
    data2.milestones.push(new Struct.Milestone(4,"label 4",date2, true))
    data2.milestones.push(new Struct.Milestone(5,"label 5",date6, true))

    test("Helpers.getMin with minimal value in milestone", ()=> {
        expect(HelperStructTimeline.getMin(data2)).toEqual(date6)
    })
}
testGetMin()

function testGetMax(){

    let data1 = new Struct.Timeline("key", "title")
    let data2 = new Struct.Timeline("key", "title")

    let date1: Date = new Date("2020-01-01")
    let date2: Date = new Date("2021-12-31")
    let date3: Date = new Date("2019-12-31")
    let date4: Date = new Date("2021-02-15")
    let date5: Date = new Date("2000-01-00")
    let date6: Date = new Date("2030-02-15")
    
    data1.tasks.push(new Struct.Task(1,"label 1", date1, date4, 100, true, "Swimline 1", 5))
    data1.tasks.push(new Struct.Task(2,"label 2", date6, date1, 100, true, "Swimline 1", 5))
    data1.tasks.push(new Struct.Task(3,"label 3", date3, date2, 100, true, "Swimline 1", 5))
    data1.tasks.push(new Struct.Task(4,"label 4", date4, date5, 100, true, "Swimline 1", 5))

    
    data1.milestones.push(new Struct.Milestone(1,"label 1",date4, true))
    data1.milestones.push(new Struct.Milestone(2,"label 2",date4, true))
    data1.milestones.push(new Struct.Milestone(3,"label 3",date4, true))
    data1.milestones.push(new Struct.Milestone(4,"label 4",date4, true))

    test("Helpers.getMax with maximal value in task.end and task.start", ()=> {
        expect(HelperStructTimeline.getMax(data1)).toEqual(date2)
    })
    
    
    data2.tasks.push(new Struct.Task(1,"label 1", date1, date4, 100, true, "Swimline 1", 5))
    data2.tasks.push(new Struct.Task(2,"label 2", date6, date1, 100, true, "Swimline 1", 5))
    data2.tasks.push(new Struct.Task(3,"label 3", date3, date4, 100, true, "Swimline 1", 5))
    data2.tasks.push(new Struct.Task(4,"label 4", date4, date5, 100, true, "Swimline 1", 5))

    
    data2.milestones.push(new Struct.Milestone(1,"label 1",date4, true))
    data2.milestones.push(new Struct.Milestone(2,"label 2",date4, true))
    data2.milestones.push(new Struct.Milestone(3,"label 3",date4, true))
    data2.milestones.push(new Struct.Milestone(4,"label 4",date4, true))
    data2.milestones.push(new Struct.Milestone(5,"label 5",date2, true))

    test("Helpers.getMax with maximal value in milestone", ()=> {
        expect(HelperStructTimeline.getMax(data2)).toEqual(date2)
    })
}
testGetMax()

function testAddTask(){
    let data = new Struct.Timeline("key", "title")
    let date1: Date = new Date("2020-01-01")
    let date2: Date = new Date("2021-12-31")

    HelperStructTimeline.addTask(data, new Struct.Task(1,"label 1", date1, date2, 100, true, "Swimline 1", 5))
    HelperStructTimeline.addTask(data, new Struct.Task(2,"label 2", date1, date2, 100, true, "Swimline 1", 5))
    HelperStructTimeline.addTask(data, new Struct.Task(3,"label 3", date1, date2, 100, true, "Swimline 1", 5))

    test("Helpers.addTask with nominal value", ()=> {
        expect(data.tasks.length).toBe(3)
        expect(data.isInitiate).toBe(true)
    })
}
testAddTask()

function testAddMilestone(){
    let data = new Struct.Timeline("key", "title")
    let date1: Date = new Date("2020-01-01")

    HelperStructTimeline.addMilestone(data, new Struct.Milestone(1,"label 1",date1, true))
    HelperStructTimeline.addMilestone(data, new Struct.Milestone(2,"label 2",date1, true))
    HelperStructTimeline.addMilestone(data, new Struct.Milestone(3,"label 3",date1, true))

    test("Helpers.addMilestone with nominal value", ()=> {
        expect(data.milestones.length).toBe(3)
        expect(data.isInitiate).toBe(true)
    })

}
testAddMilestone()


function testPurge(){
    let data = new Struct.Timeline("key", "title")
    data.showAll = true
    let dataPurged = new Struct.Timeline("key", "title")
    dataPurged.showAll = true

    let date: Date = new Date("2020-01-01")

    data.tasks.push(new Struct.Task(1,"label 1", date, date, 100, true, "Swimline 1", 5))
    data.milestones.push(new Struct.Milestone(1,"label 1", date, true))
    data.swimlines.push(new Struct.Swimline("label"))
    data.isInitiate = true
    data.end = date
    data.start = date
    data.maxId = 99
    data.viewbox = "viewbox Value"

    HelperStructTimeline.purge(data)

    test("Helpers.purge with complete data", ()=> {
        expect(data.showAll).toEqual(dataPurged.showAll)
        expect(data).toEqual(dataPurged)
    })
}
testPurge()

