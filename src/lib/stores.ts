import { writable } from 'svelte/store'
import { Graph } from './graph.class';
import { browser } from "$app/env";
import { Helpers } from './helpers.class';

let store = new Graph.Data().initiate()
if(browser){
    store : Graph.Data = (JSON.parse(localStorage.getItem("store"), Helpers.dateTimeReviver) || new Graph.Data().initiate())
    
}
export const datas = writable(store);

if(browser){
    datas.subscribe(val => localStorage.setItem("store", JSON.stringify(val)))
}
