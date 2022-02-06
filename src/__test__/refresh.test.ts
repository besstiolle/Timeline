

import { FactoryTimeline}  from "$lib/factoryTimeline"
import { Struct } from "$lib/struct.class"

jest.mock('$app/env', () => ({
    default: {
        browser: true,
      },
  }))

  //TODO retest mock avec jest
//jest.mock('$lib/helperStructTimeline.class')


/*
function testProcessLimites(){
    let timeline = new Struct.Timeline("key", "title")
    
    const mock = {
        getMin : jest.fn(),
        getMax : jest.fn(),
    }

    mock.getMin.mockReturnValue(new Date("2020-01-01"))
    mock.getMax.mockReturnValue(new Date("2020-12-31"))

    jest.mock('$lib/helperStructTimeline.class', () => ( mock))

    test("test mock result with dates", ()=> {
        expect(FactoryTimeline.getMin(timeline)).toEqual(new Date("2020-01-01"))
        expect(FactoryTimeline.getMax(timeline)).toEqual(new Date("2020-12-31"))
    })

    FactoryTimeline._processLimites(timeline)

    test("refresh._processLimites with dates", ()=> {
        expect(timeline.start).toEqual(new Date("2020-01-01"))
        expect(timeline.end).toEqual(new Date("2021-01-01"))
    })
}
testProcessLimites()*/


function testProcessLimites(){
    let timeline1 = new Struct.Timeline("key", "title")
    timeline1.tasks.push(new Struct.Task(1,"label 1", "2020-01-01", "2020-12-31", 100, true, "Swimline 1", 5))

    FactoryTimeline.refresh(timeline1)
    test("refresh._processLimites with dates", ()=> {
        expect(timeline1.start).toEqual("2020-01-01")
        expect(timeline1.getStart()).toEqual(new Date("2020-01-01"))
        expect(timeline1.end).toEqual("2021-01-01")
        expect(timeline1.getEnd()).toEqual(new Date("2021-01-01"))
    })

    let timeline2 = new Struct.Timeline("key", "title")
    timeline2.tasks.push(new Struct.Task(1,"label 1", "2020-01-15", "2020-02-01", 100, true, "Swimline 1", 5))

    FactoryTimeline.refresh(timeline2)
    test("refresh._processLimites with dates", ()=> {
        expect(timeline2.start).toEqual("2020-01-01")
        expect(timeline2.getStart()).toEqual(new Date("2020-01-01"))
        expect(timeline2.end).toEqual("2020-03-01")
        expect(timeline2.getEnd()).toEqual(new Date("2020-03-01"))
    })
}
testProcessLimites()

function testProcessViewboxResizing(){

    let date1: string = "2020-01-01"
    let taskVisible = new Struct.Task(1,"label 1", date1, date1, 100, true, "Swimline 1", 5)
    let taskHidden = new Struct.Task(1,"label 1", date1, date1, 100, false, "Swimline 1", 5)
    let timeline1 = new Struct.Timeline("key", "title")
    timeline1.showAll = false
    timeline1.tasks.push(taskVisible)
    timeline1.tasks.push(taskVisible)
    timeline1.tasks.push(taskVisible)
    timeline1.tasks.push(taskVisible)
    timeline1.tasks.push(taskVisible)
    timeline1.tasks.push(taskHidden)
    timeline1.tasks.push(taskHidden)
    timeline1.tasks.push(taskHidden)
    timeline1.tasks.push(taskHidden)
    timeline1.tasks.push(taskHidden)
    FactoryTimeline.refresh(timeline1)
    
    test("refresh.testProcessViewboxResizing without showall", ()=> {
        expect(timeline1.viewbox).toBe("0 0 1000 265")
    })

    let timeline2 = new Struct.Timeline("key", "title")
    timeline2.showAll = true
    FactoryTimeline.refresh(timeline2)

    test("refresh.testProcessViewboxResizing with showall & no task", ()=> {
        expect(timeline2.viewbox).toBe("0 0 1000 115")
    })

    let timeline3 = new Struct.Timeline("key", "title")
    timeline3.showAll = true
    timeline3.tasks.push(taskVisible)
    timeline3.tasks.push(taskVisible)
    timeline3.tasks.push(taskHidden)
    timeline3.tasks.push(taskHidden)

    FactoryTimeline.refresh(timeline3)

    test("refresh.testProcessViewboxResizing with showall & various task", ()=> {
        expect(timeline3.viewbox).toBe("0 0 1000 235")
    })
}
testProcessViewboxResizing()

function testRefreshSwimlines(){
    let timeline1 = new Struct.Timeline("key", "title")
    let date1: string = "2020-01-01"
    timeline1.tasks.push(new Struct.Task(1,"label 1", date1, date1, 100, true, "Swimline 1", 0))
    timeline1.tasks.push(new Struct.Task(2,"label 2", date1, date1, 100, false, "Swimline 2", 0))
    timeline1.tasks.push(new Struct.Task(3,"label 3", date1, date1, 100, false, "Swimline 2", 0))
    timeline1.tasks.push(new Struct.Task(4,"label 4", date1, date1, 100, false, "Swimline 1", 0))

    let timeline2 = new Struct.Timeline("key", "title")
    timeline2.tasks.push(new Struct.Task(1,"label 1", date1, date1, 100, true, "", 0))
    timeline2.tasks.push(new Struct.Task(2,"label 2", date1, date1, 100, true, "", 0))
    timeline2.tasks.push(new Struct.Task(3,"label 3", date1, date1, 100, false, "", 0))
    timeline2.tasks.push(new Struct.Task(4,"label 4", date1, date1, 100, false, "", 0))

    FactoryTimeline.refresh(timeline1)
    FactoryTimeline.refresh(timeline2)
    
    test("refresh._refreshSwimlines with various swimlines", ()=> {
        expect(timeline1.swimlines.length).toBe(3)
        expect(timeline1.swimlines[0].label).toBe("Swimline 1")
        expect(timeline1.swimlines[0].countAllTasks).toBe(1)
        expect(timeline1.swimlines[0].countVisibleTasks).toBe(1)
        expect(timeline1.swimlines[0].isShow).toBe(true)
        expect(timeline1.swimlines[1].label).toBe("Swimline 2")
        expect(timeline1.swimlines[1].countAllTasks).toBe(2)
        expect(timeline1.swimlines[1].countVisibleTasks).toBe(0)
        expect(timeline1.swimlines[1].isShow).toBe(false)
        expect(timeline1.swimlines[2].label).toBe("Swimline 1")
        expect(timeline1.swimlines[2].countAllTasks).toBe(1)
        expect(timeline1.swimlines[2].countVisibleTasks).toBe(0)
        expect(timeline1.swimlines[2].isShow).toBe(false)
    })

    test("refresh._refreshSwimlines with no swimline", ()=> {
        expect(timeline2.swimlines.length).toBe(0)
    })

}
testRefreshSwimlines()
