<script lang="ts">

import { store } from './stores';
import { Helpers } from './helpers';
import { Struct } from './struct.class';
import { Constantes } from './constantes';
import { FactoryTimeline } from './factoryTimeline';

    export let getIndex = (event) => {return 0}
    export let updateStore =  (event) => {}

    function m_delete(event){
        $store.currentTimeline.milestones.splice(getIndex(event), 1)
        $store.currentTimeline.milestones = $store.currentTimeline.milestones
    }
    function m_up(event){
        let index = getIndex(event)
        if(index == 0){
            return;
        }
        let tmpMilestone: Struct.Milestone = $store.currentTimeline.milestones[index]
        $store.currentTimeline.milestones[index] = $store.currentTimeline.milestones[index - 1]
        $store.currentTimeline.milestones[index - 1] = tmpMilestone
        $store.currentTimeline.milestones = $store.currentTimeline.milestones
    }
    function m_down(event){
        let index = getIndex(event)
        if(index == ($store.currentTimeline.milestones.length-1)){
            return;
        }
        let tmpMilestone: Struct.Milestone = $store.currentTimeline.milestones[index]
        $store.currentTimeline.milestones[index] = $store.currentTimeline.milestones[index + 1]
        $store.currentTimeline.milestones[index + 1] = tmpMilestone
        $store.currentTimeline.milestones = $store.currentTimeline.milestones
    }
    function m_show(event){
        let index = getIndex(event)
        $store.currentTimeline.milestones[index].isShow = !$store.currentTimeline.milestones[index].isShow 
    }
    function m_duplicate(event){
        let index = getIndex(event)
        let tmpMilestones : Array<Struct.Milestone> = $store.currentTimeline.milestones.splice(index+1, $store.currentTimeline.milestones.length)
        let clone = <Struct.Milestone> {... $store.currentTimeline.milestones[index]}
        clone.id = $store.currentTimeline.getNextId()
        FactoryTimeline.addMilestone($store.currentTimeline, clone )
        tmpMilestones.forEach(tmpMilestone => {
            FactoryTimeline.addMilestone($store.currentTimeline, tmpMilestone)
        });
        $store.currentTimeline.milestones = $store.currentTimeline.milestones
    }
    function m_add(){
        let diffSec : number = $store.currentTimeline.getEnd().getTime() - $store.currentTimeline.getStart().getTime()
        FactoryTimeline.addMilestone($store.currentTimeline, new Struct.Milestone(
                $store.currentTimeline.getNextId(),
                "My Milestone", 
                Helpers.toYYYY_MM_DD(new Date($store.currentTimeline.getStart().getTime() + (0.5 * diffSec))),
                true
                ))
                $store.currentTimeline.milestones = $store.currentTimeline.milestones
    }

</script>



{#each $store.currentTimeline.milestones as milestone, i}
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
    <input type="date" name="{Constantes.LIVE_PREFIX.MD}{i}" value="{milestone.date}" min="1900-01-01" max="2999-12-31" on:blur="{updateStore}">
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