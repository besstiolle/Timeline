<script lang="ts">
    import html2canvas from 'html2canvas';
    import Banner from './Banner.svelte';
    import Task from './Task.svelte';
    import Milestones from './Milestones.svelte';
    import Today from './Today.svelte';
    import { Graph } from './graph.class';
    import Upload from './Upload.svelte';
    import { datas } from './stores';


    datas.set(new Graph.Data()
            .addTask(new Graph.Task("Random Task 0", new Date("2021-01-15"), new Date("2021-04-01"),100))
            .addTask(new Graph.Task("Random Task 1", new Date("2021-12-01"), new Date("2022-04-01")))
            .addTask(new Graph.Task("Random Task 2", new Date("2021-02-01"), new Date("2021-03-05"),15))
            .addTask(new Graph.Task("Random Task 3", new Date("2021-03-10"), new Date("2021-03-30"),0))
            .addTask(new Graph.Task("Random Task 4", new Date("2021-02-01"), new Date("2021-05-01"),30))
            .addTask(new Graph.Task("Random Task 5", new Date("2021-01-31"), new Date("2021-03-01"),100))
            .addTask(new Graph.Task("Random Task 6", new Date("2021-05-01"), new Date("2021-05-05"),25))
            .addTask(new Graph.Task("Random Task 7", new Date("2021-12-01"), new Date("2022-04-01"),75))

            .addMilestone(new Graph.Milestone("Milestone 1", new Date("2020-12-01")))
            .addMilestone(new Graph.Milestone("Milestone 2", new Date()))
            .addMilestone(new Graph.Milestone("Milestone 3", new Date("2022-12-15")))
    )

    function download(){
        let csvContent = "data:text/csv;charset=utf-8," 
        + $datas.tasks.map(e => e.join(";")).join("\n")
        + "\n"
        + $datas.milestones.map(e => e.join(";")).join("\n")
        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
    }

    function getMin(tasks : Array<Graph.Task>, milestones : Array<Graph.Milestone>): Date{
        let min : Date = new Date("2999-12-31");
        tasks.forEach(task => {
            if(min > task.dateStart){
                min = task.dateStart
            }
        });
        milestones.forEach(milestone => {
            if(min > milestone.date){
                min = milestone.date
            }
        });
        return new Date(min)
    }

    function getMax(tasks : Array<Graph.Task>, milestones : Array<Graph.Milestone>): Date{
        let max : Date = new Date("1900-01-01");
        tasks.forEach(task => {
            if(max < task.dateEnd){
                max = task.dateEnd
            }
        });
        milestones.forEach(milestone => {
            if(max < milestone.date){
                max = milestone.date
            }
        });
        return new Date(max)
    }

    let start = getMin($datas.tasks, $datas.milestones)
    let end = getMax($datas.tasks, $datas.milestones)
    let taskHeight = 30;

    function takeshot() {  
        html2canvas(document.getElementById('wrapper')).then(
            function (canvas) {
                document.getElementById('output').appendChild(canvas);}
        )
    }


</script>


<button on:click={takeshot}>
    Take Screenshot
</button>
<button on:click={download}>
    Download in CSV
</button>
<Upload />

<div id="output"></div>


<div id="wrapper">
    <svg viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">

        <defs>
            <g id="target">
                <path d="M17.659,9.597h-1.224c-0.199-3.235-2.797-5.833-6.032-6.033V2.341c0-0.222-0.182-0.403-0.403-0.403S9.597,2.119,9.597,2.341v1.223c-3.235,0.2-5.833,2.798-6.033,6.033H2.341c-0.222,0-0.403,0.182-0.403,0.403s0.182,0.403,0.403,0.403h1.223c0.2,3.235,2.798,5.833,6.033,6.032v1.224c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403v-1.224c3.235-0.199,5.833-2.797,6.032-6.032h1.224c0.222,0,0.403-0.182,0.403-0.403S17.881,9.597,17.659,9.597 M14.435,10.403h1.193c-0.198,2.791-2.434,5.026-5.225,5.225v-1.193c0-0.222-0.182-0.403-0.403-0.403s-0.403,0.182-0.403,0.403v1.193c-2.792-0.198-5.027-2.434-5.224-5.225h1.193c0.222,0,0.403-0.182,0.403-0.403S5.787,9.597,5.565,9.597H4.373C4.57,6.805,6.805,4.57,9.597,4.373v1.193c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403V4.373c2.791,0.197,5.026,2.433,5.225,5.224h-1.193c-0.222,0-0.403,0.182-0.403,0.403S14.213,10.403,14.435,10.403"></path>
            </g>
            <g id="map">
                <path d="M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 M10,17.653c-1.064-1.024-4.929-5.127-4.929-10.596c0-2.68,2.212-4.861,4.929-4.861s4.929,2.181,4.929,4.861C14.927,12.518,11.063,16.627,10,17.653 M10,3.839c-1.815,0-3.286,1.47-3.286,3.286s1.47,3.286,3.286,3.286s3.286-1.47,3.286-3.286S11.815,3.839,10,3.839 M10,9.589c-1.359,0-2.464-1.105-2.464-2.464S8.641,4.661,10,4.661s2.464,1.105,2.464,2.464S11.359,9.589,10,9.589"></path>
            </g>



            <!--<g id="swimline"> <! -- h = n x 30 -- >
                <rect x="0" y="0" width="100%" height="90" fill="#EBF1DE"/>
                <rect x="0" y="0" width="150" height="90" fill="#2980B9"/>
                <text text-anchor="middle" x="75" y="45" font-family="Verdana" font-size="10" fill="#FFFFFF">Swimline Title</text>
            </g> -->


        </defs>

        {#each $datas.tasks as task, i}
            <Task start={start} end={end} i={i} task={task}/>
            <use x="0" y="{i*taskHeight + 115}" href="#T{i}"/>
        {/each}
        
        <!-- SWIMLINES-- >
        <use x="0" y="270" href="#swimline"/>
        
        <use x="200" y="275" href="#JComplete"/><! -- +30 / jalon au dessus-- >
        <text text-anchor="end" x="195" y="286" font-family="Verdana" font-size="9" fill="#000">Random task</text> <! -- y+11 / au dessus-- >  <! -- x-5 / au dessus-- > 

        <use x="225" y="305" href="#JUncompleteL"/>
        <text text-anchor="end" x="220" y="316" font-family="Verdana" font-size="9" fill="#000">Random task</text>
        
        <use x="250" y="335" href="#JUncompleteR"/>
        <text text-anchor="end" x="245" y="346" font-family="Verdana" font-size="9" fill="#000">Random task</text>
        <! -- SWIMLINES-->

        <Banner start={start} end={end}/>
        <Today  start={start} end={end}/>        
        <Milestones start={start} end={end} milestones={$datas.milestones}/>
         

    </svg>
</div>