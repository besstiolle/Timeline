
<script lang="ts">
import { Constantes } from "./constantes.class";
import { Helpers } from "./helpers.class";
import { store } from "./stores";
import type { Struct } from "./struct.class";
import Task from "./Task.svelte";

const taskHeight = 30;


let colors = [
    ["#90BBD8", "#2980B9"],
    ["#86CBBE", "#16A085"],
    ["#C9D9A8", "#9BBB59"],
    ["#F5C984", "#F39C12"],
    ["#DB9891", "#C0392B"],
    ["#C6CECE", "#95A5A6"],
    ["#A191A3", "#4B2C50"]
]

let tasksShown: Struct.Task[] = []
$store.tasks.forEach(task => {
    if(task.isShow){
        tasksShown.push(task)
    }
});
let mapSwimlines = Helpers.computeMapSwimlines(tasksShown)

</script>         

<defs>
    {#each [...mapSwimlines] as [key, swimline]}
    <g id="swimline{key}"> <!-- h = n x 30 -->
        <rect x="0" y="0" width="{Constantes.GRID.ALL_WIDTH}" height="{swimline.countVisibleTasks * 30 - 0.5}" fill="{colors[key % colors.length][0]}"/>
        <rect x="0" y="0" width="{Constantes.GRID.LEFT_WIDTH}" height="{swimline.countVisibleTasks * 30 - 0.5}" fill="{colors[key % colors.length][1]}"/>
        <text text-anchor="middle" x="{Constantes.GRID.LEFT_WIDTH / 2}" y="{swimline.countVisibleTasks * 30 / 2}" font-family="Verdana" font-size="10" fill="#FFFFFF">{swimline.label}</text>
    </g>
    {/each}
</defs>

{#each tasksShown as task, i}
    {#if mapSwimlines.has(i)}
        <use x="0" y="{i*taskHeight + 110}" href="#swimline{i}"/>
    {/if}
    <Task currentTask={task} i={i}/>
    <use x="0" y="{i*taskHeight + 115}" href="#T{i}"/>
{/each}
