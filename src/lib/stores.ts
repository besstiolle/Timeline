import { writable } from 'svelte/store'
import { Struct } from './struct.class';
import { browser } from "$app/env";

export const store = writable(new Struct.Data().initiate());

if(browser){
    store.subscribe(val => updateLocalStorage(val))
}

function updateLocalStorage(val){
    if(browser){
        if( typeof val === "object"){
            //Refresh datemin / max
            val.processLimites()

            //Saving into LocalStorage
            localStorage.setItem("store", JSON.stringify(val))
        } else {
            console.error("typof val is not an object : " + typeof val)
        }
        
    }
}