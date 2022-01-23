
import { Struct } from "$lib/struct.class";
import { Helpers } from "$lib/helpers.class";
import { Constantes } from "$lib/constantes.class";



/************************************* */

function testToISODateString(){
    let date1 = new Date("2020-01-01")
    let date2 = new Date("2020-01-01")
    date2.setHours(10)
    date2.setMinutes(20)
    date2.setSeconds(30)
    test("Helpers.toISODateString with nominal values", ()=> {
        expect(Helpers.toISODateString(date1)).toBe("2020-01-01")
        expect(Helpers.toISODateString(date2)).toBe("2020-01-01")
    })
}
testToISODateString()
/************************************* */

function testCountVisibleTasksInList(){
    const task1 = new Struct.Task(1,"label 1", new Date(), new Date, 100, true, "Swimline 1", 5)
    const task2 = new Struct.Task(2,"label 2", new Date(), new Date, 100, true, "Swimline 1", 4)
    const task3 = new Struct.Task(3,"label 3", new Date(), new Date, 100, true, null, 3)
    const task4 = new Struct.Task(4,"label 4", new Date(), new Date, 100, false, "Swimline 2", 2)
    const task5 = new Struct.Task(5,"label 5", new Date(), new Date, 100, false, null, 1)

    let mapAllVisible = new Array<Struct.Task>()
    let mapAllHidden = new Array<Struct.Task>()
    let mapAllMixed = new Array<Struct.Task>()
    let mapEmpty = new Array<Struct.Task>()
    mapAllVisible[task1.id] = task1
    mapAllVisible[task2.id] = task2
    mapAllVisible[task3.id] = task3
    test("Helpers.countVisibleTasksInList with all visible tasks", ()=> {
        expect(Helpers.countVisibleTasksInList(mapAllVisible)).toBe(3)
    })
    mapAllHidden[task4.id] = task4
    mapAllHidden[task5.id] = task5
    test("Helpers.countVisibleTasksInList with all hidden tasks", ()=> {
        expect(Helpers.countVisibleTasksInList(mapAllHidden)).toBe(0)
    })
    mapAllMixed[task1.id] =  task1
    mapAllMixed[task2.id] = task2
    mapAllMixed[task3.id] = task3
    mapAllMixed[task4.id] = task4
    mapAllMixed[task5.id] = task5
    test("Helpers.countVisibleTasksInList with mixed tasks", ()=> {
        expect(Helpers.countVisibleTasksInList(mapAllMixed)).toBe(3)
    })

    test("Helpers.countVisibleTasksInList with no task", ()=> {
        expect(Helpers.countVisibleTasksInList(mapEmpty)).toBe(0)
    })
}
testCountVisibleTasksInList()

/************************************* */
function testGetDateFromViewportX(){
    let dateMin: Date = new Date("2021-01-01")
    let dateMax: Date = new Date("2021-01-30")
    let viewportX = (Constantes.GRID.MIDDLE_WIDTH - Constantes.GRID.MIDDLE_X) / 30
    let expectedDate = new Date("2021-01-2")
    test("Helpers.getDateFromViewportX with out-of bound value", ()=> {
        expect(Helpers.getDateFromViewportX(0, dateMin, dateMax)).toEqual(dateMin)
    })
    test("Helpers.getDateFromViewportX with min value", ()=> {
        expect(Helpers.getDateFromViewportX(Constantes.GRID.MIDDLE_X, dateMin, dateMax)).toEqual(dateMin)
    })
    test("Helpers.getDateFromViewportX with max value", ()=> {
        expect(Helpers.getDateFromViewportX(Constantes.GRID.MIDDLE_X + Constantes.GRID.MIDDLE_WIDTH, dateMin, dateMax)).toEqual(dateMax)
    })
    /*
    test("Helpers.getDateFromViewportX with fixed value", ()=> {
        expect(Helpers.getDateFromViewportX(viewportX, dateMin, dateMax)).toEqual(expectedDate)
    })*/
    /*let middle_x = 150
    let middle_w = 775
    let result = new Date((Math.ceil(150 + 775)  - middle_x) * (dateMax.getTime() - dateMin.getTime()) / middle_w + dateMin.getTime())
    test("test", ()=> {
        expect(result).toEqual(dateMax)
    })
    let result2 = new Date((Math.ceil(150 + 775)  - middle_x) * (dateMax.getTime() - dateMin.getTime()) / middle_w + dateMin.getTime())
    result2.setHours(0, 0, 0, 0)
    test("test", ()=> {
        expect(result2).toEqual(dateMax)
    })*/
}
testGetDateFromViewportX()

/************************************* */

function testGetViewportXFromDate(){
    let dateMin2: Date = new Date("2021-01-01")
    let dateMax2: Date = new Date("2021-01-30")
    let dateToTest1: Date = new Date("2021-01-15")
    let dateToTest2: Date = new Date("2021-01-10")

    test("Helpers.getViewportXFromDate with min value", ()=> {
        expect(Helpers.getViewportXFromDate(dateMin2, dateMin2, dateMax2)).toBe(Constantes.GRID.MIDDLE_X)
    })
    test("Helpers.getViewportXFromDate with max value", ()=> {
        expect(Helpers.getViewportXFromDate(dateMax2, dateMin2, dateMax2)).toBe(Constantes.GRID.MIDDLE_X + Constantes.GRID.MIDDLE_WIDTH)
    })/*
    test("Helpers.getViewportXFromDate with fixed value", ()=> {
        expect(Helpers.getViewportXFromDate(dateToTest1, dateMin2, dateMax2)).toBe((Constantes.GRID.MIDDLE_X + (Constantes.GRID.MIDDLE_WIDTH / 2)))
        expect(Helpers.getViewportXFromDate(dateToTest2, dateMin2, dateMax2)).toBe((Constantes.GRID.MIDDLE_X + (Constantes.GRID.MIDDLE_WIDTH / 3)))
    })*/
}
testGetViewportXFromDate()
/************************************* */

function testBothViewportFunctions(){
    let dateMin3: Date = new Date("2020-01-01")
    let dateMax3: Date = new Date("2021-12-31")

    let dateInput = new Date("2020-01-15")/*
    let dateResult = Helpers.getDateFromViewportX(Helpers.getViewportXFromDate(dateInput, dateMin3, dateMax3), dateMin3, dateMax3)
    test("Helpers.getViewportXFromDate & getDateFromViewportX", ()=> {
        expect(dateResult).toBe(dateInput)
    })*/

    let viewportXInput = (Constantes.GRID.MIDDLE_WIDTH / 5) +  Constantes.GRID.MIDDLE_X
    let viewportXResult = Helpers.getViewportXFromDate(Helpers.getDateFromViewportX(viewportXInput, dateMin3, dateMax3), dateMin3, dateMax3)
    test("Helpers.getDateFromViewportX & getViewportXFromDate", ()=> {
        expect(viewportXInput).toBe(viewportXResult)
    })
}
testBothViewportFunctions()
/************************************* */

