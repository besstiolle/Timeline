

import { HelperStructData } from "$lib/helperStructData.class"
import { Struct } from "$lib/struct.class"

jest.mock('$app/env', () => ({
    default: {
        browser: true,
      },
  }))


  

//Workaround to access private methods
// see : https://stackoverflow.com/a/61658365
//Object.getPrototypeOf(HelperStructData)._processLimites()
/*
function testProcessLimites(){
    let data = new Struct.Data()
    
    const mock = {
        getMin : jest.fn(),
        getMax : jest.fn(),
    }

    mock.getMin.mockReturnValue(new Date("2020-01-01"))
    mock.getMax.mockReturnValue(new Date("2020-12-31"))

    jest.mock('$lib/helperStructData.class', () => ( mock))

    test("test mock result with dates", ()=> {
        expect(HelperStructData.getMin(data)).toEqual(new Date("2020-01-01"))
        expect(HelperStructData.getMax(data)).toEqual(new Date("2020-12-31"))
    })

    HelperStructData._processLimites(data)

    test("refresh._processLimites with dates", ()=> {
        expect(data.start).toEqual(new Date("2020-01-01"))
        expect(data.end).toEqual(new Date("2021-01-01"))
    })
}
testProcessLimites()
*/

function testProcessLimites(){
    let data1 = new Struct.Data()
    data1.tasks.push(new Struct.Task(1,"label 1", new Date("2020-01-01"), new Date("2020-12-31"), 100, true, "Swimline 1", 5))

    HelperStructData._processLimites(data1)
    test("refresh._processLimites with dates", ()=> {
        expect(data1.start).toEqual(new Date("2020-01-01"))
        expect(data1.end).toEqual(new Date("2021-01-01"))
    })

    let data2 = new Struct.Data()
    data2.tasks.push(new Struct.Task(1,"label 1", new Date("2020-01-15"), new Date("2020-02-01"), 100, true, "Swimline 1", 5))

    HelperStructData._processLimites(data2)
    test("refresh._processLimites with dates", ()=> {
        expect(data2.start).toEqual(new Date("2020-01-01"))
        expect(data2.end).toEqual(new Date("2020-03-01"))
    })
}
testProcessLimites()

function testProcessViewboxResizing(){
    //Nothing usefull to test
}
