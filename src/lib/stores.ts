import { writable } from 'svelte/store'
import { Struct } from './struct.class';
import { browser } from "$app/env";
import { HelperStructData } from './helperStructData.class';

export const store = writable(HelperStructData.initiate(new Struct.Data()));

store.subscribe(val => updateLocalStorage(val))


function updateLocalStorage(val){
    
    //Refresh datemin / max and other compiled data
    HelperStructData.refresh(<Struct.Data> val)

    if(browser){
        if( typeof val === "object"){
            //Saving into LocalStorage
            localStorage.setItem("store", JSON.stringify(val))
        } else {
            console.error("typof val is not an object : " + typeof val)
        }
    }
}