<script lang="ts">

import { store } from './stores';
import { Helpers } from './helpers';
import { Struct } from './struct.class';
import { FactoryTimeline } from './factoryTimeline';
import { LIVE_PREFIX } from './constantes';
import { FactoryMilestone } from './factoryMilestone';
	import { m } from '../paraglide/messages';

export let updateStore:Function

function m_delete(index:number){
    if(index < 0 || index > $store.currentTimeline.milestones.length -1){
        console.warn("index was abnormal", index)
        return;
    }
    $store.currentTimeline.milestones.splice(index, 1)
    $store.currentTimeline.milestones = $store.currentTimeline.milestones
}
function m_up(index:number){
    if(index <= 0 || index > $store.currentTimeline.milestones.length -1){
        console.warn("index was abnormal", index)
        return;
    }
    let tmpMilestone: Struct.Milestone = $store.currentTimeline.milestones[index]
    $store.currentTimeline.milestones[index] = $store.currentTimeline.milestones[index - 1]
    $store.currentTimeline.milestones[index - 1] = tmpMilestone
    $store.currentTimeline.milestones = $store.currentTimeline.milestones
}
function m_down(index:number){
    if(index < 0 || index >= $store.currentTimeline.milestones.length -1){
        console.warn("index was abnormal", index)
        return;
    }
    let tmpMilestone: Struct.Milestone = $store.currentTimeline.milestones[index]
    $store.currentTimeline.milestones[index] = $store.currentTimeline.milestones[index + 1]
    $store.currentTimeline.milestones[index + 1] = tmpMilestone
    $store.currentTimeline.milestones = $store.currentTimeline.milestones
}
function m_show(index:number){
    
    if(index < 0 || index > $store.currentTimeline.milestones.length -1){
        console.warn("index was abnormal", index)
        return;
    }
    $store.currentTimeline.milestones[index].isShow = !$store.currentTimeline.milestones[index].isShow 
}
function m_duplicate(index:number){
    
    if(index < 0 || index > $store.currentTimeline.milestones.length -1){
        console.warn("index was abnormal", index)
        return;
    }
    let tmpMilestones : Array<Struct.Milestone> = $store.currentTimeline.milestones.splice(index+1, $store.currentTimeline.milestones.length)

    FactoryTimeline.addMilestone($store.currentTimeline, 
                                FactoryMilestone.clone($store.currentTimeline.milestones[index],
                                                       $store.currentTimeline.getNextId(),
                                                        " (copy)"))
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
    
    <div data-name="M{i}"  class="live_cmd" on:click="{e =>{m_show(i)}}" on:keydown="{e =>{m_show(i)}}" title={m.live_milestone_editor_toggle()} role="button" tabindex="0">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_show"/>
        </svg>
    </div>
    <div data-name="M{i}"  class="live_cmd" on:click="{e =>{m_up(i)}}" on:keydown="{e =>{m_up(i)}}" title={m.live_milestone_editor_down()} role="button" tabindex="0">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_up"/>
        </svg>
    </div>
    <div data-name="M{i}"  class="live_cmd" on:click="{e =>{m_down(i)}}" on:keydown="{e =>{m_down(i)}}" title={m.live_milestone_editor_up()} role="button" tabindex="0">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_down"/>
        </svg>
    </div>
    <div data-name="M{i}"  class="live_cmd" on:click="{e =>{m_duplicate(i)}}" on:keydown="{e =>{m_duplicate(i)}}" title={m.live_milestone_editor_clone()} role="button" tabindex="0">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_duplicate"/>
        </svg>
    </div>
    <div data-name="M{i}"  class="live_cmd live_cmd_red" on:click="{e =>{m_delete(i)}}" on:keydown="{e =>{m_delete(i)}}" title={m.live_milestone_editor_delete()} role="button" tabindex="0">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_delete"/>
        </svg>
    </div>
    <input type="text" bind:value="{milestone.label}" class="label"/>
    <input type="date" id="{LIVE_PREFIX.MD}{i}" value="{milestone.date}" min="1900-01-01" max="2999-12-31" on:change={() => updateStore(LIVE_PREFIX.MD, i)} on:blur="{() => updateStore(LIVE_PREFIX.MD, i)}">
</div>
{/each}

<div class="live__action">
    <div class="live__action__button" on:click="{m_add}" on:keydown="{m_add}"  role="button" tabindex="0">
        <svg class="svg-icon" viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_add"/>
        </svg>
        <span>{m.live_milestone_editor_new()}</span>
    </div>
</div>