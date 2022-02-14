<script lang="ts">
import { GRID, MONTHS } from './constantes';


    import { store } from './stores';

   /* function monthDiff(d1: Date, d2: Date) {
        let months: number;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }*/

 //   let oneDay = 86400 * 1000
 //   let days = oneDay * 15 // < 15 days
 //   let weeks = oneDay * 7 * 15 // < 15 weeks
 //   let months = oneDay * 30 * 15 // < 15 months (+/-)
 //   let decade = oneDay * 30 * 12 * 15 // < 15 years (+/-)


/*
    if(end-start > decade){
        console.info("trops");
    } else if(end-start > months){
        console.info("decade");
    } else if(end-start > weeks){
        console.info("months");
    } else if(end-start > days){
        console.info("weeks");
    } else if(end-start > days){
        console.info("days");
    } else {
        console.info("oneDay");   
    }*/


    let dateInc = new Date($store.currentTimeline.start);

    let i=0
    let jalons=[]
    while ($store.currentTimeline.getEnd().getFullYear() > dateInc.getFullYear() || 
            ($store.currentTimeline.getEnd().getFullYear() == dateInc.getFullYear() && $store.currentTimeline.getEnd().getMonth() >= dateInc.getMonth()) && i < 100){
        i++;
        jalons.push({
            left:(dateInc.getTime() - $store.currentTimeline.getStart().getTime()) / ($store.currentTimeline.getEnd().getTime() - $store.currentTimeline.getStart().getTime()) * GRID.MIDDLE_WIDTH,
            label:(dateInc.getMonth()==0?dateInc.getUTCFullYear():MONTHS[dateInc.getMonth()]),
            classCss:(dateInc.getMonth()==0?"newYear":"")
            //label:MONTHS[dateInc.getMonth()]
        })

        dateInc = new Date(dateInc.setMonth(dateInc.getMonth()+1));
    }
</script>

    
<defs>
    <linearGradient id="Gradient1" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#475569"/>
        <stop offset="100%" stop-color="#4F5764" />
    </linearGradient>
    
    <linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#475569" stop-opacity="0.3"/>
        <stop offset="100%" stop-opacity="0"/>
    </linearGradient>
</defs>

<svg data-testid='Banner.svelte' viewBox="{$store.currentTimeline.viewbox}" xmlns="http://www.w3.org/2000/svg" 
    x="{GRID.LEFT_WIDTH}" y="{GRID.MILESTONE_H}">
    
    <rect x="-10" y="0" width="{GRID.MIDDLE_WIDTH + 50}" height="25" fill="url(#Gradient1)"/>
    <rect x="-10" y="30" width="{GRID.MIDDLE_WIDTH + 50}" height="25" fill="url(#Gradient2)"/>
    {#each jalons as { left, label, classCss}, i}
        <path d="M{parseInt(left) } 6 v 14" fill="transparent" stroke="#818C9C"/>
        <text data-testid='jalonText_{i}' x="{parseInt(left) + 5}" y="17" font-size="12" fill="#818C9C" class="{classCss}">{label}</text>
    {/each}
</svg>

<style>
    :global(.newYear){
        fill:rgb(222, 184, 135)
    }

</style>