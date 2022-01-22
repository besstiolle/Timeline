<script lang="ts">
import { browser } from '$app/env';

    
    import { Constantes } from './constantes.class';
    import { HelperStructMilestone } from './helperStructMilestone.class';
    import { store } from './stores';
    import type { Struct } from './struct.class';

    function compareMilestone(a : Struct.Milestone, b : Struct.Milestone){
        if(a.date > b.date){return 1}
        if(a.date < b.date){return -1}
        return 0
    }

    let milestones: Struct.Milestone[] = []
    $store.milestones.forEach(milestone => { 
        if(milestone.isShow || $store.showAll){
            milestones.push(milestone)
        }
    });
    //Sort by date ASC
    milestones = milestones.sort(compareMilestone)


    let ghostSVGNode: HTMLElement  = null
    let currentTarget: HTMLElement = null
    let hoverGroup: boolean = false
    let recBox: DOMRect = null

    const GHOST_SVG_NODE_ID: string = "ghostSVGNode"
    /**
     * Triggered every time user try to "grab" an svg group of Milestone
     * @param event the event mousedown
     */
    function down(event){
        //Avoid selecting text. source : https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
        event.preventDefault();
        currentTarget = event.currentTarget //currentTarget => svg, target => sub element of svg
        ghostSVGNode = <HTMLElement> currentTarget.cloneNode(true)
        ghostSVGNode.setAttribute("id", GHOST_SVG_NODE_ID)
    
        //Find the last node of our SVG group
        let endMilestoneNode = document.getElementById("endMilestoneNode")

        //create ghost node <svg> after the last node of our SVG group
        endMilestoneNode.parentNode.insertBefore(ghostSVGNode, endMilestoneNode)
        
        //Refresh our ghost Node reference
        ghostSVGNode = document.getElementById(GHOST_SVG_NODE_ID)

        ghostSVGNode.classList.add("grabbing")
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

            let milestones = HelperStructMilestone.getById($store, parseInt(idMilestone))
            milestones.date = date
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
<rect id="milestonesSection" x="{Constantes.GRID.MIDDLE_X}" y="0" width="{Constantes.GRID.MIDDLE_WIDTH}" height="{Constantes.GRID.MILESTONE_H}" 
    stroke-dasharray="0.5 2" fill="transparent" class:onhover={ghostSVGNode && hoverGroup} />
{#each milestones as milestone, i}
    <svg viewBox="{$store.viewbox}" xmlns="http://www.w3.org/2000/svg" 
        x="{Constantes.GRID.MIDDLE_X + (milestone.date.getTime() - $store.start.getTime()) / ($store.end.getTime() - $store.start.getTime()) * Constantes.GRID.MIDDLE_WIDTH - 10}" y="{i%2 * 25}" 
        class="milestoneSVGSection" class:shouldBeHidden={!milestone.isShow} on:mousedown={down} id="M{milestone.id}" >
        
        <use x="0" y="0" href="#mapfiller" fill="transparent" stroke="transparent" class="toExcludeFromSnapshot"/>
        <use x="0" y="0" href="#map" />
        {#if i%2 == 0}
        <line stroke-dasharray="1" x1="10" y1="20" x2="10" y2="50" stroke="#000" />
        {:else}
        <line stroke-dasharray="1" x1="10" y1="20" x2="10" y2="25" stroke="#000" />
        {/if}
        <text x="17" y="9" font-size="10" fill="#000">{milestone.label}</text>
        <text x="17" y="18" fill="#44546A">{milestone.date.getDate()}-{Constantes.MONTHS[milestone.date.getMonth()]}</text>
    </svg>
    <line id='endMilestoneNode' x1="0" y1="0" x2="0" y2="0" stroke="transparent" />
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
:global(.milestoneSVGSection){
    cursor: grab;
}
:global(.milestoneSVGSection.grabbing){
    cursor: grabbing;
}
:global(#GHOST_SVG_NODE_ID){
    opacity: 0.5;
}
</style>