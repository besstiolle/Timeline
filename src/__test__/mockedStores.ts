import { Rights } from '$lib/rights.class';
import { Struct } from '$lib/struct.class';
import { writable } from 'svelte/store'

export const store = writable(new Struct.TimelineStore(new Array<Struct.Card>,new Struct.Timeline(),new Rights()));

store.subscribe(val => void(val))
