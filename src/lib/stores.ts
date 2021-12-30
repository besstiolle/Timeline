import { writable } from 'svelte/store'
import { Graph } from './graph.class';

export const datas = writable(new Graph.Data());