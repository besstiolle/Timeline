<script lang="ts">
import { browser } from '$app/env';

    
    import { Constantes } from './constantes.class';
    import Milestone from './Milestone.svelte';
    import { store } from './stores';
    import type { Struct } from './struct.class';

    function compareMilestone(a : Struct.Milestone, b : Struct.Milestone){
        if(a.date > b.date){return 1}
        if(a.date < b.date){return -1}
        return 0
    }

    let milestones: Struct.Milestone[] = []
    $store.milestones.forEach(milestone => {
        if(milestone.isShow){
            milestones.push(milestone)
        }
    });
    //Sort by date ASC
    milestones = milestones.sort(compareMilestone)


    let svgUseNode: HTMLElement  = null
    let svgGNode: HTMLElement  = null
    let svgDefsNode: HTMLElement  = null
    let target: HTMLElement = null
    let hoverGroup = false
    const GHOST_USE_NODE_ID = "ghostUseNode"
    const GHOST_G_NODE_ID = "ghostGNode"
    const GHOST_DEFS_NODE_ID = "ghostDefsNode"
    /**
     * Triggered every time user try to "grab" an svg group of Milestone
     * @param event the event mousedown
     */
    function down(event){
        target = event.target
        svgUseNode = event.target.cloneNode(true)
        svgGNode = <HTMLElement> document.getElementById(svgUseNode.getAttribute("href").substring(1)).cloneNode(true) // substring : remove prefix '#'
    
        //Find the last node of our SVG group
        let endMilestoneNode = document.getElementById("endMilestoneNode")

        //create ghost node <defs>
        svgDefsNode = document.createElement("defs")
        svgDefsNode.setAttribute("id", GHOST_DEFS_NODE_ID)
        endMilestoneNode.parentNode.insertBefore(svgDefsNode, endMilestoneNode)

        //create ghost node <g>
        svgGNode.id = GHOST_G_NODE_ID
        svgDefsNode.appendChild(svgGNode)

        //create ghost node <use>
        svgUseNode.id = GHOST_USE_NODE_ID
        svgUseNode.setAttribute("href", "#" + GHOST_G_NODE_ID)
        endMilestoneNode.parentNode.insertBefore(svgUseNode, endMilestoneNode)
    }

    /**
     * Triggered every time user release the left clic of the mouse
     * @param event the event mouseup
     */
    function up(event){
        if(svgUseNode && hoverGroup){
            let newX = event.clientX / window.innerWidth * Constantes.GRID.ALL_WIDTH
            let date = processNewDate(newX - Constantes.GRID.MIDDLE_X)
            let idMilestone = target.getAttribute("href").substring(2) // #M999 => 999

            let milestones = $store.getMilestonesById(parseInt(idMilestone))
            milestones.date = date
            $store.processLimites()
            $store.milestones = $store.milestones
            
        }

        //Reset vars
        let ghostUseNode = document.getElementById(GHOST_USE_NODE_ID)
        if(ghostUseNode) {
            ghostUseNode.remove()
        }
        let ghostGNode = document.getElementById(GHOST_G_NODE_ID)
        if(ghostGNode) {
            ghostGNode.remove()
        }
        let svgDefsNode = document.getElementById(GHOST_DEFS_NODE_ID)
        if(svgDefsNode) {
            svgDefsNode.remove()
        }
        svgUseNode = null
        svgGNode = null
        svgDefsNode = null
        target = null
    }
    
    let recBox: DOMRect = null

    /**
     * Triggered every time user move the mouse
     * @param event the event mousemove
     */
     function move(event){

        if(!recBox && browser){
            recBox = document.getElementById("milestonesSection").getBoundingClientRect()
        }

        if(hoverGroup && (event.clientX <= recBox.left || event.clientX >= recBox.right
                || event.clientY <= recBox.top || event.clientY >= recBox.bottom)){
            hoverGroup = false
        }

        if(!hoverGroup && event.clientX > recBox.left && event.clientX < recBox.right && event.clientY > recBox.top && event.clientY < recBox.bottom){
            hoverGroup = true
        }

        if(hoverGroup){
            //Moving ghostUseNode on the axe <===> 
            if(svgUseNode){
                let newX = event.clientX / window.innerWidth * Constantes.GRID.ALL_WIDTH
                svgUseNode.setAttribute('x', `${newX - 10}`)

                //Get new Date
                let newDate: Date = processNewDate(newX - Constantes.GRID.MIDDLE_X)
                let newDateLabel = newDate.getDate() + "-" + Constantes.MONTHS[newDate.getMonth()]
                let svgGDateLabelNode : HTMLElement = <HTMLElement> svgGNode.lastChild
                if(svgGDateLabelNode){
                    svgGDateLabelNode.innerHTML = newDateLabel
                }
            } 
        }
    }

    function processNewDate(newX: number){
        let ratio = $store.start.getTime() + (newX / Constantes.GRID.MIDDLE_WIDTH * ($store.end.getTime() - $store.start.getTime()))
        return new Date(ratio)
    }


</script>

<svelte:window on:mouseup={up} on:mousemove="{move}"/>
<rect id="milestonesSection" x="{Constantes.GRID.MIDDLE_X}" y="0" width="{Constantes.GRID.MIDDLE_WIDTH}" height="50" 
    stroke-dasharray="0.5 2" style="" class:onhover={svgUseNode && hoverGroup} />
{#each milestones as milestone, i}
    {#if milestone.isShow}
        <Milestone i={i} milestone={milestone} down={down}/>
        <line id='endMilestoneNode' x1="0" y1="0" x2="0" y2="0" stroke="transparent" />
    {/if}
{/each}


<style>

#milestonesSection {
    stroke-width: 0.05em;
    fill: transparent;
}
:global(#milestonesSection.onhover){
    stroke: cadetblue;
    cursor: grab;
    fill: rgb(164, 185, 185)

}
:global(.milestoneSection){
    cursor: grab;
}
:global(#ghostGNode){
    opacity: 0.5;
}
</style>