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


    let ghostSVGNode: HTMLElement  = null
    let currentTarget: HTMLElement = null
    let hoverGroup: boolean = false
    let recBox: DOMRect = null

    const GHOST_SVG_NODE_ID = "ghostSVGNode"
    /**
     * Triggered every time user try to "grab" an svg group of Milestone
     * @param event the event mousedown
     */
    function down(event){
        currentTarget = event.currentTarget //currentTarget => svg, target => sub element of svg
        ghostSVGNode = <HTMLElement> currentTarget.cloneNode(true)
        ghostSVGNode.setAttribute("id", GHOST_SVG_NODE_ID)
    
        //Find the last node of our SVG group
        let endMilestoneNode = document.getElementById("endMilestoneNode")

        //create ghost node <svg> after the last node of our SVG group
        endMilestoneNode.parentNode.insertBefore(ghostSVGNode, endMilestoneNode)
        
        //Refresh our ghost Node reference
        ghostSVGNode = document.getElementById(GHOST_SVG_NODE_ID)

    }

    /**
     * Triggered every time user release the left clic of the mouse
     * @param event the event mouseup
     */
    function up(event){
        if(ghostSVGNode && hoverGroup){
            let newX = event.clientX / window.innerWidth * Constantes.GRID.ALL_WIDTH
            let date = processNewDate(newX - Constantes.GRID.MIDDLE_X)
            let idMilestone = currentTarget.getAttribute("id").substring(1) // M999 => 999

            let milestones = $store.getMilestonesById(parseInt(idMilestone))
            milestones.date = date
            $store.processLimites()
            $store.milestones = $store.milestones 
        }

        //Reset vars
        if(ghostSVGNode){
            ghostSVGNode.remove()
            ghostSVGNode = null
        }
        currentTarget = null
    }
    

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

        //Moving ghostUseNode on the axe <===> 
        if(ghostSVGNode && hoverGroup){
            let newX = event.clientX / window.innerWidth * Constantes.GRID.ALL_WIDTH
            ghostSVGNode.setAttribute('x', `${newX - 10}`)

            //Get new Date
            let newDate: Date = processNewDate(newX - Constantes.GRID.MIDDLE_X)
            let newDateLabel = newDate.getDate() + "-" + Constantes.MONTHS[newDate.getMonth()]
            let svgGDateLabelNode : HTMLElement = <HTMLElement> ghostSVGNode.lastChild
            if(svgGDateLabelNode){
                svgGDateLabelNode.innerHTML = newDateLabel
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
    stroke-dasharray="0.5 2" style="" class:onhover={ghostSVGNode && hoverGroup} />
{#each milestones as milestone, i}
    {#if milestone.isShow}
        <Milestone level={i%2} milestone={milestone} down={down}/>
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
:global(#GHOST_SVG_NODE_ID){
    opacity: 0.5;
}
</style>