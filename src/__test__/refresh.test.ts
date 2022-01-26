

import { HelperStructTimeline}  from "$lib/helperStructTimeline.class"
import { Struct } from "$lib/struct.class"

jest.mock('$app/env', () => ({
    default: {
        browser: true,
      },
  }))

//jest.mock('$lib/helperStructTimeline.class')


/*
function testProcessLimites(){
    let data = new Struct.Timeline("key", "title")
    
    const mock = {
        getMin : jest.fn(),
        getMax : jest.fn(),
    }

    mock.getMin.mockReturnValue(new Date("2020-01-01"))
    mock.getMax.mockReturnValue(new Date("2020-12-31"))

    jest.mock('$lib/helperStructTimeline.class', () => ( mock))

    test("test mock result with dates", ()=> {
        expect(HelperStructTimeline.getMin(data)).toEqual(new Date("2020-01-01"))
        expect(HelperStructTimeline.getMax(data)).toEqual(new Date("2020-12-31"))
    })

    HelperStructTimeline._processLimites(data)

    test("refresh._processLimites with dates", ()=> {
        expect(data.start).toEqual(new Date("2020-01-01"))
        expect(data.end).toEqual(new Date("2021-01-01"))
    })
}
testProcessLimites()
*/

function testProcessLimites(){
    let data1 = new Struct.Timeline("key", "title")
    data1.tasks.push(new Struct.Task(1,"label 1", new Date("2020-01-01"), new Date("2020-12-31"), 100, true, "Swimline 1", 5))

    HelperStructTimeline.refresh(data1)
    test("refresh._processLimites with dates", ()=> {
        expect(data1.start).toEqual(new Date("2020-01-01"))
        expect(data1.end).toEqual(new Date("2021-01-01"))
    })

    let data2 = new Struct.Timeline("key", "title")
    data2.tasks.push(new Struct.Task(1,"label 1", new Date("2020-01-15"), new Date("2020-02-01"), 100, true, "Swimline 1", 5))

    HelperStructTimeline.refresh(data2)
    test("refresh._processLimites with dates", ()=> {
        expect(data2.start).toEqual(new Date("2020-01-01"))
        expect(data2.end).toEqual(new Date("2020-03-01"))
    })
}
testProcessLimites()

function testProcessViewboxResizing(){

    let date1: Date = new Date("2020-01-01")
    let taskVisible = new Struct.Task(1,"label 1", date1, date1, 100, true, "Swimline 1", 5)
    let taskHidden = new Struct.Task(1,"label 1", date1, date1, 100, false, "Swimline 1", 5)
    let data1 = new Struct.Timeline("key", "title")
    data1.showAll = false
    data1.tasks.push(taskVisible)
    data1.tasks.push(taskVisible)
    data1.tasks.push(taskVisible)
    data1.tasks.push(taskVisible)
    data1.tasks.push(taskVisible)
    data1.tasks.push(taskHidden)
    data1.tasks.push(taskHidden)
    data1.tasks.push(taskHidden)
    data1.tasks.push(taskHidden)
    data1.tasks.push(taskHidden)
    HelperStructTimeline.refresh(data1)
    
    test("refresh.testProcessViewboxResizing without showall", ()=> {
        expect(data1.viewbox).toBe("0 0 1000 265")
    })

    let data2 = new Struct.Timeline("key", "title")
    data2.showAll = true
    HelperStructTimeline.refresh(data2)

    test("refresh.testProcessViewboxResizing with showall & no task", ()=> {
        expect(data2.viewbox).toBe("0 0 1000 115")
    })

    let data3 = new Struct.Timeline("key", "title")
    data3.showAll = true
    data3.tasks.push(taskVisible)
    data3.tasks.push(taskVisible)
    data3.tasks.push(taskHidden)
    data3.tasks.push(taskHidden)

    HelperStructTimeline.refresh(data3)

    test("refresh.testProcessViewboxResizing with showall & various task", ()=> {
        expect(data3.viewbox).toBe("0 0 1000 235")
    })
}
testProcessViewboxResizing()

function testRefreshSwimlines(){
    let data1 = new Struct.Timeline("key", "title")
    let date1: Date = new Date("2020-01-01")
    data1.tasks.push(new Struct.Task(1,"label 1", date1, date1, 100, true, "Swimline 1", 0))
    data1.tasks.push(new Struct.Task(2,"label 2", date1, date1, 100, false, "Swimline 2", 0))
    data1.tasks.push(new Struct.Task(3,"label 3", date1, date1, 100, false, "Swimline 2", 0))
    data1.tasks.push(new Struct.Task(4,"label 4", date1, date1, 100, false, "Swimline 1", 0))

    let data2 = new Struct.Timeline("key", "title")
    data2.tasks.push(new Struct.Task(1,"label 1", date1, date1, 100, true, "", 0))
    data2.tasks.push(new Struct.Task(2,"label 2", date1, date1, 100, true, "", 0))
    data2.tasks.push(new Struct.Task(3,"label 3", date1, date1, 100, false, "", 0))
    data2.tasks.push(new Struct.Task(4,"label 4", date1, date1, 100, false, "", 0))

    HelperStructTimeline.refresh(data1)
    HelperStructTimeline.refresh(data2)
    
    test("refresh._refreshSwimlines with various swimlines", ()=> {
        expect(data1.swimlines.length).toBe(3)
        expect(data1.swimlines[0].label).toBe("Swimline 1")
        expect(data1.swimlines[0].countAllTasks).toBe(1)
        expect(data1.swimlines[0].countVisibleTasks).toBe(1)
        expect(data1.swimlines[0].isShow).toBe(true)
        expect(data1.swimlines[1].label).toBe("Swimline 2")
        expect(data1.swimlines[1].countAllTasks).toBe(2)
        expect(data1.swimlines[1].countVisibleTasks).toBe(0)
        expect(data1.swimlines[1].isShow).toBe(false)
        expect(data1.swimlines[2].label).toBe("Swimline 1")
        expect(data1.swimlines[2].countAllTasks).toBe(1)
        expect(data1.swimlines[2].countVisibleTasks).toBe(0)
        expect(data1.swimlines[2].isShow).toBe(false)
    })

    test("refresh._refreshSwimlines with no swimline", ()=> {
        expect(data2.swimlines.length).toBe(0)
    })

}
testRefreshSwimlines()
