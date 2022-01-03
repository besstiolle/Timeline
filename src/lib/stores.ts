import { writable } from 'svelte/store'
import { Graph } from './graph.class';
import { browser } from "$app/env";

export const datas = writable(new Graph.Data().initiate());

if(browser){
    datas.subscribe(val => updateLocalStorage(val))
}

function updateLocalStorage(val){
    if(browser){
        if( typeof val === "object"){
            localStorage.setItem("store", JSON.stringify(val))
        } else {
            console.info("erreur : typof val is " + typeof val)
        }
        
    }
}