
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Struct } from "$lib/struct.class";
import { Helpers } from "$lib/helpers";
import { DIFF, GRID } from "$lib/constantes";

describe('Helpers File DateConvertor testing', () => {

    it('Helpers.toYYYYMMDD_hhmm with nominal values', () => {

        let date1 = new Date("2020-01-01T03:24:00")
        let date2 = new Date("2020-01-01T13:00:01")
        expect(Helpers.toYYYYMMDD_hhmm(date1)).toBe("20200101_0324")
        expect(Helpers.toYYYYMMDD_hhmm(date2)).toBe("20200101_1300")
    })

    it('Helpers.toYYYY_MM_DD with nominal values', () => {

        let date1 = new Date("2020-01-01")
        let date2 = new Date("2020-01-01T10:20:30")
        expect(Helpers.toYYYY_MM_DD(date1)).toBe("2020-01-01")
        expect(Helpers.toYYYY_MM_DD(date2)).toBe("2020-01-01")
    })

})


/************************************* */

describe('Helpers.countVisibleTasksInList', () => {
    const task1 = new Struct.Task(1,"label 1", "2020-01-01", "2020-01-01", true, 100, true, "Swimline 1", 5)
    const task2 = new Struct.Task(2,"label 2", "2020-01-01", "2020-01-01", true, 100, true, "Swimline 1", 4)
    // @ts-ignore
    const task3 = new Struct.Task(3,"label 3", "2020-01-01", "2020-01-01", true, 100, true, null, 3)
    const task4 = new Struct.Task(4,"label 4", "2020-01-01", "2020-01-01", true, 100, false, "Swimline 2", 2)
    // @ts-ignore
    const task5 = new Struct.Task(5,"label 5", "2020-01-01", "2020-01-01", true, 100, false, null, 1)

    let mapAllVisible = new Array<Struct.Task>()
    let mapAllHidden = new Array<Struct.Task>()
    let mapAllMixed = new Array<Struct.Task>()
    let mapEmpty = new Array<Struct.Task>()
    mapAllVisible[task1.id] = task1
    mapAllVisible[task2.id] = task2
    mapAllVisible[task3.id] = task3

    it('Helpers.countVisibleTasksInList with all visible tasks', () => {
        expect(Helpers.countVisibleTasksInList(mapAllVisible)).toBe(3)
    })
    mapAllHidden[task4.id] = task4
    mapAllHidden[task5.id] = task5
    it('Helpers.countVisibleTasksInList with all hidden tasks', () => {
        expect(Helpers.countVisibleTasksInList(mapAllHidden)).toBe(0)
    })
    
    mapAllMixed[task1.id] =  task1
    mapAllMixed[task2.id] = task2
    mapAllMixed[task3.id] = task3
    mapAllMixed[task4.id] = task4
    mapAllMixed[task5.id] = task5
    it('Helpers.countVisibleTasksInList with mixed tasks', () => {
        expect(Helpers.countVisibleTasksInList(mapAllMixed)).toBe(3)
    })
    it('Helpers.countVisibleTasksInList with no task', () => {
        expect(Helpers.countVisibleTasksInList(mapEmpty)).toBe(0)
    })
})

/************************************* */
describe('Helpers.getDateFromViewportX', () => {
    let dateMin: Date = new Date("2021-01-01")
    let dateMax: Date = new Date("2021-01-30")
    let viewportX = (GRID.MIDDLE_WIDTH - GRID.MIDDLE_X) / 30
    let expectedDate = new Date("2021-01-2")
    it("Helpers.getDateFromViewportX with out-of bound value", ()=> {
        expect(Helpers.getDateFromViewportX(0, dateMin, dateMax)).toEqual(dateMin)
        expect(Helpers.getDateFromViewportX(99999, dateMin, dateMax)).toEqual(dateMax)
    })
    it("Helpers.getDateFromViewportX with min value", ()=> {
        expect(Helpers.getDateFromViewportX(GRID.MIDDLE_X, dateMin, dateMax)).toEqual(dateMin)
    })
    it("Helpers.getDateFromViewportX with max value", ()=> {
        expect(Helpers.getDateFromViewportX(GRID.MIDDLE_X + GRID.MIDDLE_WIDTH, dateMin, dateMax)).toEqual(dateMax)
    })
    /*
    it("Helpers.getDateFromViewportX with fixed value", ()=> {
        expect(Helpers.getDateFromViewportX(viewportX, dateMin, dateMax)).toEqual(expectedDate)
    })*/
    /*let middle_x = 150
    let middle_w = 775
    let result = new Date((Math.ceil(150 + 775)  - middle_x) * (dateMax.getTime() - dateMin.getTime()) / middle_w + dateMin.getTime())
    it("test", ()=> {
        expect(result).toEqual(dateMax)
    })
    let result2 = new Date((Math.ceil(150 + 775)  - middle_x) * (dateMax.getTime() - dateMin.getTime()) / middle_w + dateMin.getTime())
    result2.setHours(0, 0, 0, 0)
    it("test", ()=> {
        expect(result2).toEqual(dateMax)
    })*/
})

/************************************* */

describe('Helpers.getViewportXFromDate', () => {
    let dateMin2: Date = new Date("2021-01-01")
    let dateMax2: Date = new Date("2021-01-30")
    let dateToTest1: Date = new Date("2021-01-15")
    let dateToTest2: Date = new Date("2021-01-10")

    it("Helpers.getViewportXFromDate with min value", ()=> {
        expect(Helpers.getViewportXFromDate(dateMin2, dateMin2, dateMax2)).toBe(GRID.MIDDLE_X)
    })
    it("Helpers.getViewportXFromDate with max value", ()=> {
        expect(Helpers.getViewportXFromDate(dateMax2, dateMin2, dateMax2)).toBe(GRID.MIDDLE_X + GRID.MIDDLE_WIDTH)
    })/*
    it("Helpers.getViewportXFromDate with fixed value", ()=> {
        expect(Helpers.getViewportXFromDate(dateToTest1, dateMin2, dateMax2)).toBe((GRID.MIDDLE_X + (GRID.MIDDLE_WIDTH / 2)))
        expect(Helpers.getViewportXFromDate(dateToTest2, dateMin2, dateMax2)).toBe((GRID.MIDDLE_X + (GRID.MIDDLE_WIDTH / 3)))
    })*/
})
/************************************* */

describe('Helpers.getViewportXFromDate', () => {
    let dateMin3: Date = new Date("2020-01-01")
    let dateMax3: Date = new Date("2021-12-31")

    let dateInput = new Date("2020-01-15")/*
    let dateResult = Helpers.getDateFromViewportX(Helpers.getViewportXFromDate(dateInput, dateMin3, dateMax3), dateMin3, dateMax3)
    it("Helpers.getViewportXFromDate & getDateFromViewportX", ()=> {
        expect(dateResult).toBe(dateInput)
    })*/

    let viewportXInput = (GRID.MIDDLE_WIDTH / 5) +  GRID.MIDDLE_X
    let viewportXResult = Helpers.getViewportXFromDate(Helpers.getDateFromViewportX(viewportXInput, dateMin3, dateMax3), dateMin3, dateMax3)
    it("Helpers.getDateFromViewportX & getViewportXFromDate", ()=> {
        expect(viewportXInput).toBe(viewportXResult)
    })
})
/************************************* */

describe('Helpers.randomeString', () => {

    it("Helpers.randomeString with various size", ()=> {
        expect(Helpers.randomeString(0).length).toBe(0)
        expect(Helpers.randomeString(15).length).toBe(15)
    })
})
/************************************* */

describe('Helpers.printf', () => {
    it("Helpers.printf with normal values", ()=> {
        expect(Helpers.printf("{0} somme text {1}.", ['foo', 'bar'])).toBe("foo somme text bar.")
        expect(Helpers.printf("{0} somme text {1}.", ["f'oo", 3])).toBe("f'oo somme text 3.")
    })
    it("Helpers.printf with limits values", ()=> {
        expect(Helpers.printf("{0} somme text {1}.", ["f'oo", 3, 'none'])).toBe("f'oo somme text 3.")
        expect(Helpers.printf("{0} somme text {1}.", ["f'oo"])).toBe("f'oo somme text {1}.")
        expect(Helpers.printf("{0} somme text {1}.",[])).toBe("{0} somme text {1}.")
        expect(Helpers.printf("somme text.",['foo', 'bar'])).toBe("somme text.")
    })
})
/************************************* */

describe('Helpers.getEstimationOfDiff', () => {

    let start: Date = new Date("2000-01-01")
    let end: Date

    it("Helpers.getEstimationOfDiff with nominal value at date J", ()=> {
        end = new Date(start)
        expect(Helpers.getEstimationOfDiff(start, end)).toBe(DIFF.isBelow1Month)
    })
    it("Helpers.getEstimationOfDiff with nominal value at date J+1", ()=> {
        end = new Date(start)
        end.setDate(end.getDate()+1)
        expect(Helpers.getEstimationOfDiff(start,end)).toBe(DIFF.isBelow1Month)
    })
    it("Helpers.getEstimationOfDiff with nominal value at date J+31", ()=> {
        end = new Date(start)
        end.setDate(end.getDate()+31)
        expect(Helpers.getEstimationOfDiff(start, end)).toBe(DIFF.isBelow1Month)
    })
    it("Helpers.getEstimationOfDiff with nominal value at date M+3", ()=> {
        end = new Date(start)
        end.setMonth(end.getMonth()+3)
        expect(Helpers.getEstimationOfDiff(start, end)).toBe(DIFF.isBetween1MonthAnd5Months)
    })
    
    it("Helpers.getEstimationOfDiff with nominal value at date M+6", ()=> {
        end = new Date(start)
        end.setMonth(end.getMonth()+6)
        expect(Helpers.getEstimationOfDiff(start, end)).toBe(DIFF.isBetween5MonthsAnd20Months)
    })
    it("Helpers.getEstimationOfDiff with nominal value at date Y+2", ()=> {
        end = new Date(start)
        end.setFullYear(end.getFullYear()+2)
        expect(Helpers.getEstimationOfDiff(start, end)).toBe(DIFF.isBetween20MonthsAnd3Years)
    })
    it("Helpers.getEstimationOfDiff with nominal value at date Y+4", ()=> {
        end = new Date(start)
        end.setFullYear(end.getFullYear()+4)
        expect(Helpers.getEstimationOfDiff(start, end)).toBe(DIFF.isBetween3YearsAnd6Years)
    })
    it("Helpers.getEstimationOfDiff with nominal value at date Y+7", ()=> {
        end = new Date(start)
        end.setFullYear(end.getFullYear()+7)
        expect(Helpers.getEstimationOfDiff(start, end)).toBe(DIFF.isBetween6YearsAnd10Years)
    })
    it("Helpers.getEstimationOfDiff with nominal value at date Y+15", ()=> {
        end = new Date(start)
        end.setFullYear(end.getFullYear()+15)
        expect(Helpers.getEstimationOfDiff(start, end)).toBe(DIFF.isBetween10YearsAnd20Years)
    })
    it("Helpers.getEstimationOfDiff with nominal value at date Y+100", ()=> {
        end = new Date(start)
        end.setFullYear(end.getFullYear()+100)
        expect(Helpers.getEstimationOfDiff(start, end)).toBe(DIFF.isMoreThan20Years)
    })
})

