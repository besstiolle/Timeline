<script lang="ts">

    import { store } from './stores';
    import { Helpers } from './helpers.class';
    import { Struct } from './struct.class';
    import { Constantes } from './constantes.class';
    import { HelperStructData } from './helperStructData.class';

    export let getIndex = (event) => {return 0}
    export let updateStore =  (event) => {}

    function m_delete(event){
        $store.milestones.splice(getIndex(event), 1)
        $store.milestones = $store.milestones
    }
    function m_up(event){
        let index = getIndex(event)
        if(index == 0){
            return;
        }
        let tmpMilestone: Struct.Milestone = $store.milestones[index]
        $store.milestones[index] = $store.milestones[index - 1]
        $store.milestones[index - 1] = tmpMilestone
        $store.milestones = $store.milestones
    }
    function m_down(event){
        let index = getIndex(event)
        if(index == ($store.milestones.length-1)){
            return;
        }
        let tmpMilestone: Struct.Milestone = $store.milestones[index]
        $store.milestones[index] = $store.milestones[index + 1]
        $store.milestones[index + 1] = tmpMilestone
        $store.milestones = $store.milestones
    }
    function m_show(event){
        let index = getIndex(event)
        $store.milestones[index].isShow = !$store.milestones[index].isShow 
    }
    function m_duplicate(event){
        let index = getIndex(event)
        let tmpMilestones : Array<Struct.Milestone> = $store.milestones.splice(index+1, $store.milestones.length)
        let clone = {... $store.milestones[index]}
        clone.id = $store.getNextId()
        HelperStructData.addMilestone($store, clone )
        tmpMilestones.forEach(tmpMilestone => {
            HelperStructData.addMilestone($store, tmpMilestone)
        });
        $store.milestones = $store.milestones
    }
    function m_add(){
        let diffSec : number = $store.end.getTime() - $store.start.getTime()
        HelperStructData.addMilestone($store, new Struct.Milestone(
                $store.getNextId(),
                "My Milestone", 
                new Date($store.start.getTime() + (0.5 * diffSec)),
                true
                ))
                $store.milestones = $store.milestones
    }

</script>



{#each $store.milestones as milestone, i}
<div class="live__line show_{milestone.isShow}">
    
    <div name="M{i}"  class="live_cmd" on:click="{m_show}" title="hide/show this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_show"/>
        </svg>
    </div>
    <div name="M{i}"  class="live_cmd" on:click="{m_up}" title="go down this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_up"/>
        </svg>
    </div>
    <div name="M{i}"  class="live_cmd" on:click="{m_down}" title="go up this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_down"/>
        </svg>
    </div>
    <div name="M{i}"  class="live_cmd" on:click="{m_duplicate}" title="duplicate this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_duplicate"/>
        </svg>
    </div>
    <div name="M{i}"  class="live_cmd live_cmd_red" on:click="{m_delete}" title="delete this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_delete"/>
        </svg>
    </div>
    <input type="text" bind:value="{milestone.label}" class="label"/>
    <input type="date" name="{Constantes.LIVE_PREFIX.MD}{i}" value="{Helpers.toISODateString(milestone.date)}" min="1900-01-01" max="2999-12-31" on:blur="{updateStore}">
</div>
{/each}

<div class="live__action">
    <div class="live__action__button" on:click="{m_add}" >
        <svg class="svg-icon" viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_add"/>
        </svg>
        <span>Add a new Milestone</span>
    </div>
</div>