import { Rights } from '$lib/rights.class';
import { Card, Timeline, TimelineStore } from '$lib/struct.class';
import { writable } from 'svelte/store';

export const store = writable(new TimelineStore(new Array<Card>(), new Timeline(), new Rights()));

store.subscribe((val) => void val);
