import { writable } from 'svelte/store'
import { Struct } from './struct.class';
import { browser } from "$app/env";
import { HelperStructTimeline } from './helperStructTimeline.class';

export const store = writable(HelperStructTimeline.initiate(new Struct.Timeline()));

store.subscribe(val => updateLocalStorage(val))


function updateLocalStorage(val){
    
    //Refresh datemin / max and other compiled data
    HelperStructTimeline.refresh(<Struct.Timeline> val)

    if(browser){
        if( typeof val === "object"){
            //Saving into LocalStorage
            localStorage.setItem("store", JSON.stringify(val))
        } else {
            console.error("typof val is not an object : " + typeof val)
        }
    }
}