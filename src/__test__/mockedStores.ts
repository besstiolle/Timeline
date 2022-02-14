import { Struct } from '$lib/struct.class';
import { writable } from 'svelte/store'

export const store = writable(new Struct.TimelineStore());

store.subscribe(val => void(val))
