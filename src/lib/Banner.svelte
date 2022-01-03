<script lang="ts">

    import BannerLabel from './BannerLabel.svelte';
    import { Constantes } from './constantes.class';
    import { store } from './stores';

    function monthDiff(d1: Date, d2: Date) {
        let months: number;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

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


    let dateInc = new Date($store.start);

    let i=0
    let jalons=[]
    while ($store.end.getFullYear() > dateInc.getFullYear() || 
            ($store.end.getFullYear() == dateInc.getFullYear() && $store.end.getMonth() >= dateInc.getMonth()) && i < 100){
        i++;
        jalons.push({
            left:(dateInc.getTime() - $store.start.getTime()) / ($store.end.getTime() - $store.start.getTime()) * Constantes.GRID.MIDDLE_WIDTH,
            label:(dateInc.getMonth()==0?dateInc.getUTCFullYear():Constantes.MONTHS[dateInc.getMonth()])
            //label:Constantes.MONTHS[dateInc.getMonth()]
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
    
    

    <g id="annual">
        <rect x="-10" y="0" width="{Constantes.GRID.MIDDLE_WIDTH + 50}" height="25" fill="url(#Gradient1)"/>
        <rect x="-10" y="30" width="{Constantes.GRID.MIDDLE_WIDTH + 50}" height="25" fill="url(#Gradient2)"/>
        {#each jalons as { left, label }, i}
            <BannerLabel left={left} label={label}/>
        {/each}
    </g>

</defs>

<use x="{Constantes.GRID.LEFT_WIDTH}" y="50" href="#annual"/>