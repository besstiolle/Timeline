
<script lang="ts">
import { Constantes } from "./constantes.class";
import { Helpers } from "./helpers.class";
import { store } from "./stores";
import type { Struct } from "./struct.class";
import Task from "./Task.svelte";

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

function down(){
    //TODO
}

</script>         

<svg viewBox="0 0 {Constantes.GRID.ALL_WIDTH} {Constantes.GRID.MILESTONE_H + Constantes.GRID.BANNER_H + Constantes.GRID.ONE_TASK_H * Helpers.countVisibleTask($store.tasks) + Constantes.GRID.TODAY_H}" 
xmlns="http://www.w3.org/2000/svg" x="0" y="{Constantes.GRID.MILESTONE_H + Constantes.GRID.BANNER_H - 5}" 
>
{#each tasksShown as task, i}
    {#if mapSwimlines.has(i)}

        <rect x="0" y="{i * Constantes.GRID.ONE_TASK_H}" 
            width="{Constantes.GRID.ALL_WIDTH}" height="{mapSwimlines.get(i).countVisibleTasks * Constantes.GRID.ONE_TASK_H - 0.5}" 
            fill="{colors[i % colors.length][0]}"/>

        <rect x="0" y="{i * Constantes.GRID.ONE_TASK_H}" 
            width="{Constantes.GRID.LEFT_WIDTH}" height="{mapSwimlines.get(i).countVisibleTasks * Constantes.GRID.ONE_TASK_H - 0.5}" 
            fill="{colors[i % colors.length][1]}"/>

        <text text-anchor="middle" x="{Constantes.GRID.LEFT_WIDTH / 2}" y="{i * Constantes.GRID.ONE_TASK_H + mapSwimlines.get(i).countVisibleTasks * Constantes.GRID.ONE_TASK_H / 2}" 
            font-family="Verdana" font-size="10" fill="#FFFFFF">{mapSwimlines.get(i).label}</text>

    {/if}
{/each}
</svg>

{#each tasksShown as task, i}
    <Task currentTask={task} i={i} down={down}/>
{/each}
