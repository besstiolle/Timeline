<script lang="ts">
    import { datas } from './stores';
    import { Helpers } from './helpers.class';


    const TS : string = "taskStart_"
    const TE : string = "taskEnd_"
    const MD : string = "milestoneDate_"

    function updateStore(event){
        
        let position : number = null;
        if(event.target.name.startsWith(TS)){
            position = parseInt(event.target.name.substring(TS.length, event.target.name.length))
            $datas.tasks[position].dateStart = new Date(event.target.value)
        }
        
        if(event.target.name.startsWith(TE)){
            position = parseInt(event.target.name.substring(TE.length, event.target.name.length))
            $datas.tasks[position].dateEnd = new Date(event.target.value)
        }
        
        if(event.target.name.startsWith(MD)){
            position = parseInt(event.target.name.substring(MD.length, event.target.name.length))            
            $datas.milestones[position].date = new Date(event.target.value)
        }

        
    }

</script>

<div id="output"></div>
<div>
    <input type="text" bind:value="{$datas.tasks[0].label}"/>
    <input type="date" name="{TS}0" value="{Helpers.toISODateString($datas.tasks[0].dateStart)}" min="1900-01-01" max="2999-12-31" on:change="{updateStore}">
    <input type="date" name="{TE}0" value="{Helpers.toISODateString($datas.tasks[0].dateEnd)}" min="1900-01-01" max="2999-12-31" on:change="{updateStore}">
    <input type="number" bind:value="{$datas.tasks[0].progress}" min="0" max="100" />
    <progress id="file" max="100" value="{$datas.tasks[0].progress}"> {$datas.tasks[0].progress}% </progress>
</div>

<div>
    <input type="text" bind:value="{$datas.milestones[0].label}"/>
    <input type="date" name="{MD}0" value="{Helpers.toISODateString($datas.milestones[0].date)}" min="1900-01-01" max="2999-12-31" on:change="{updateStore}">
</div>