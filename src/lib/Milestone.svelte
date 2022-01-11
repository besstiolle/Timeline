<script lang="ts">
    import type { Struct } from "./struct.class";
    import { Constantes } from './constantes.class';
    import { store } from "./stores";
    import { Helpers } from "./helpers.class";

    export let milestone: Struct.Milestone
    export let level:number
    export let down

    let xMilestonePosition =  (milestone.date.getTime() - $store.start.getTime()) / ($store.end.getTime() - $store.start.getTime()) * Constantes.GRID.MIDDLE_WIDTH
</script>

<svg viewBox="0 0 {Constantes.GRID.ALL_WIDTH} {Constantes.GRID.MILESTONE_H + Constantes.GRID.BANNER_H + Constantes.GRID.ONE_TASK_H * Helpers.countVisibleTask($store.tasks) + Constantes.GRID.TODAY_H}" 
     xmlns="http://www.w3.org/2000/svg" x="{Constantes.GRID.MIDDLE_X + xMilestonePosition - 10}" y="{level * 25}" 
     class="milestoneSection" on:mousedown={down} id="M{milestone.id}" >
    <use x="0" y="0" href="#map"/>
    {#if level == 0}
    <line stroke-dasharray="1" x1="10" y1="20" x2="10" y2="50" stroke="#000" />
    {:else}
    <line stroke-dasharray="1" x1="10" y1="20" x2="10" y2="25" stroke="#000" />
    {/if}
    <text x="17" y="9" font-family="Verdana" font-size="10" fill="#000">{milestone.label}</text>
    <text x="17" y="18" font-family="Verdana" font-size="8" fill="#44546A">{milestone.date.getDate()}-{Constantes.MONTHS[milestone.date.getMonth()]}</text>
</svg>
