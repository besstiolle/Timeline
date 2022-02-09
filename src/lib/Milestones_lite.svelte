<script lang="ts">
import { store } from './stores';
import { Constantes } from './constantes';
import type { Struct } from './struct.class';


    //TODO : fix color assignation for timelines

    let milestones: Struct.Milestone[] = $store.currentTimeline.milestones


</script>

<rect id="milestonesSection" x="{Constantes.GRID.MIDDLE_X}" y="0" width="{Constantes.GRID.MIDDLE_WIDTH}" height="{Constantes.GRID.MILESTONE_H}" 
    stroke-dasharray="0.5 2" fill="transparent"  />
{#each milestones as milestone, i}
    <svg viewBox="{$store.currentTimeline.viewbox}" xmlns="http://www.w3.org/2000/svg" 
        x="{Constantes.GRID.MIDDLE_X + (milestone.getDate().getTime() - $store.currentTimeline.getStart().getTime()) / ($store.currentTimeline.getEnd().getTime() - $store.currentTimeline.getStart().getTime()) * Constantes.GRID.MIDDLE_WIDTH - 10}" y="{i%2 * 25}" 
        class="milestoneSVGSection" class:shouldBeHidden={!milestone.isShow} id="M{milestone.id}" >
        
        <use x="0" y="0" href="#mapfiller" fill="transparent" stroke="transparent" class="toExcludeFromSnapshot"/>
        <use x="0" y="0" href="#map" />
        {#if i%2 == 0}
        <line stroke-dasharray="1" x1="10" y1="20" x2="10" y2="50" stroke="#000" />
        {:else}
        <line stroke-dasharray="1" x1="10" y1="20" x2="10" y2="25" stroke="#000" />
        {/if}
        <text x="17" y="9" font-size="10" fill="#000">{milestone.label}</text>
        <text x="17" y="18" fill="#44546A">{milestone.getDate().getDate()}-{Constantes.MONTHS[milestone.getDate().getMonth()]}</text>
    </svg>
    <line id='endMilestoneNode' x1="0" y1="0" x2="0" y2="0" stroke="transparent" />
{/each}


<style>

#milestonesSection {
    stroke-width: 0.05em;
    fill: transparent;
}
</style>