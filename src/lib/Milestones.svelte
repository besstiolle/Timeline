<script lang="ts">
    
    import { Constantes } from './constantes.class';
    import Milestone from './Milestone.svelte';
    import { store } from './stores';
    import type { Struct } from './struct.class';

    function compareMilestone(a : Struct.Milestone, b : Struct.Milestone){
        if(a.date > b.date){return 1}
        if(a.date < b.date){return -1}
        return 0
    }
</script>

    
<defs>
    <g id="milestones">
        {#each $store.milestones.sort(compareMilestone) as milestone, i}
            {#if milestone.isShow}
                <Milestone i={i} milestone={milestone}/>
            {/if}
        {/each}
    </g>
</defs>

<use x="{Constantes.GRID.MIDDLE_X}" y="0" href="#milestones"/>

