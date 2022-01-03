<script lang="ts">
    
    import { Constantes } from './constantes.class';
    import Milestone from './Milestone.svelte';
    import { store } from './stores';

</script>

    
<defs>
    <g id="milestones">
        {#each $store.milestones as milestone, i}
            {#if milestone.isShow}
                <Milestone i={i} milestone={milestone}/>
            {/if}
        {/each}
    </g>
</defs>

<use x="{Constantes.GRID.MIDDLE_X}" y="0" href="#milestones"/>

