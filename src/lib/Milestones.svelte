<script lang="ts">
    
    import { Constantes } from './constantes.class';
    import Milestone from './Milestone.svelte';
    import { store } from './stores';

</script>

    
<defs>
    <g id="milestones">
        {#each $store.milestones as milestone, i}
            <Milestone i={i} milestone={milestone}/>
        {/each}
    </g>
</defs>

<use x="{Constantes.GRID.MIDDLE_X}" y="0" href="#milestones"/>

