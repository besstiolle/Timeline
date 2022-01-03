<script lang="ts">

    import { datas } from './stores';
    import { Helpers } from './helpers.class';
    import { Graph } from './graph.class';
    import { Constantes } from './constantes.class';

    export let getIndex = (event) => {return 0}
    export let updateStore =  (event) => {}

    export let start: Date;
    export let end: Date;


    function m_delete(event){
        $datas.milestones.splice(getIndex(event), 1)
        $datas.milestones = $datas.milestones
    }
    function m_up(event){
        let index = getIndex(event)
        if(index == 0){
            return;
        }
        let tmpMilestone: Graph.Milestone = $datas.milestones[index]
        $datas.milestones[index] = $datas.milestones[index - 1]
        $datas.milestones[index - 1] = tmpMilestone
    }
    function m_down(event){
        let index = getIndex(event)
        if(index == ($datas.milestones.length-1)){
            return;
        }
        let tmpMilestone: Graph.Milestone = $datas.milestones[index]
        $datas.milestones[index] = $datas.milestones[index + 1]
        $datas.milestones[index + 1] = tmpMilestone
    }
    function m_show(event){
        console.info("show : " + getIndex(event))
        let index = getIndex(event)
        $datas.milestones[index].isShow = !$datas.milestones[index].isShow 
    }
    function m_duplicate(event){
        let index = getIndex(event)
        let tmpMilestones : Array<Graph.Milestone> = $datas.milestones.splice(index+1, $datas.milestones.length)
        $datas.milestones.push( $datas.milestones[index].clone() )
        tmpMilestones.forEach(tmpMilestone => {
            $datas.milestones.push( tmpMilestone )
        });
        $datas.milestones = $datas.milestones
    }
    function m_add(){
        let diffSec : number = end.getTime() - start.getTime()
        $datas.milestones.push(new Graph.Milestone(
                "My Milestone", 
                new Date(start.getTime() + (0.5 * diffSec))
                ))
        $datas.milestones = $datas.milestones
    }
</script>



{#each $datas.milestones as milestone, i}
<div class="live__line show_{milestone.isShow}">
    
    <div name="M{i}"  class="live_cmd live_cmd_red" on:click="{m_delete}" title="delete this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_delete"/>
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
    <div name="M{i}"  class="live_cmd" on:click="{m_show}" title="hide/show this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_show"/>
        </svg>
    </div>
    <div name="M{i}"  class="live_cmd" on:click="{m_duplicate}" title="duplicate this line">
        <svg viewBox="0 0 20 20">
            <use x="0" y="0" href="#b_duplicate"/>
        </svg>
    </div>
    <input type="text" bind:value="{milestone.label}" class="label"/>
    <input type="date" name="{Constantes.LIVE_PREFIX.MD}{i}" value="{Helpers.toISODateString(milestone.date)}" min="1900-01-01" max="2999-12-31" on:change="{updateStore}">
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