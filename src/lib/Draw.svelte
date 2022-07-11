<script lang="ts">
import html2canvas from 'html2canvas';

import { store } from './stores';
import { browser } from "$app/env";

import { Helpers } from './helpers';

import Banner from './Banner.svelte';
import Milestones from './Milestones.svelte';
import Today from './Today.svelte';
import Upload from './Upload.svelte';
import Live from './Live.svelte';
import SwimAndTasks from './SwimAndTasks.svelte';
import Online from './Online.svelte';
import MilestonesLite from './Milestones_lite.svelte';
import SwimAndTasksLite from './SwimAndTasks_lite.svelte';
import Toast from './Toast.svelte';
import { FactoryPicto } from './factoryPicto';

    let toastComponent
    let openOnlineComponent, commitOnlineComponent, openUploadComponent, openLiveComponent

    const delay = ms => new Promise(res => setTimeout(res, ms));

    let processRunning = false
    /**
     * Generate a thumbbnail every 30s and save it into the localstorage
     */
    let makeThumbnail = async () => {
        await delay(30000) // 30s
        if(!processRunning && browser) { //avoid ReferenceError: Image is not defined
            processRunning=true
            var image = new Image();
            html2canvas(document.getElementById('wrapper'), {
                ignoreElements: function (el) {return el.classList.contains('toExcludeFromSnapshot')},
                logging:false
            }).then(function (canvas) {
                var ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0, 128, 128)
                var dataurl = canvas.toDataURL('image/jpeg', 0.1)
                FactoryPicto.createPicto($store.currentTimeline, dataurl)
                processRunning=false
                makeThumbnail()
            }).finally(() => {
                processRunning=false
            })
        } else if(!browser) {
            return
        } else {
            console.info("process was busy, we'll waiting 30s more")
            makeThumbnail()
        }
    }
    makeThumbnail()

    /**
     * Generate a screenshot from the chart and save it on computer as a png image
     */
    function takeshot():void {  
        html2canvas(document.getElementById('wrapper'), {
            ignoreElements: function (el) {return el.classList.contains('toExcludeFromSnapshot')},
            logging:false
        }).then(function (canvas) {
            canvas.toBlob(function(blob) {
                download(blob, ".png")      
            });
        });
    }

    /**
     * Implement a custom download file
     * @param blob the binaries to download
     * @param extensionName the name of the file
     */
    function download(blob: Blob, extensionName:string):void{
        var url = URL.createObjectURL(blob)
        var downloadLink = document.createElement("a")
        downloadLink.href = url
        downloadLink.download = $store.currentTimeline.title 
                                + '_' 
                                + Helpers.toYYYYMMDD_hhmm(new Date()) 
                                + extensionName
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink) 
    }

    function toggleShowHide(){
        $store.currentTimeline.showAll = !$store.currentTimeline.showAll
    }

</script>
<div class="rightButtons">
    {#key $store}
    <div class="rightButtonDisabled" class:hidden={!$store.rights.hasWriter() || ($store.lastUpdatedLocally - $store.lastCommitedRemotely > 2 * 1000)} title="There is nothing to save"><i class='saveCloud'></i></div>
    <div class="rightButton" class:hidden={!$store.rights.hasWriter() || $store.commitInProgress || ($store.lastUpdatedLocally - $store.lastCommitedRemotely < 2 * 1000)} on:click={commitOnlineComponent} title="Save your modifications remotly"><i class='saveCloud'></i></div>

    <div class="rightButton" class:hidden={!$store.rights.isNone()} on:click={openOnlineComponent} title="Share & save your chart online"><i class='online'></i></div>
    <div class="rightButton" class:hidden={!$store.rights.isOwner()} on:click={openOnlineComponent} title="Save your chart on your computer only"><i class='offline'></i></div>

    
    <div class="rightButton" class:hidden={!$store.currentTimeline.showAll} on:click={toggleShowHide} title="Show regular tasks"><i class='hide'></i></div>
    <div class="rightButton" class:hidden={$store.currentTimeline.showAll} on:click={toggleShowHide} title="Show all tasks even if they're hidden"><i class='show'></i></div>
    {/key}
    <div class="rightButton" class:hidden={!$store.rights.isNone() && !$store.rights.hasWriter()} on:click={openUploadComponent} title='Import/Export your data'><i class='io'></i></div>
    <div class="rightButton" on:click={takeshot} title='Take a screenshot'><i class='photo'></i></div>
    <div class="rightButton" class:hidden={!$store.rights.isNone() && !$store.rights.hasWriter()} on:click={openLiveComponent} title='Edit your milestones'><i class='edit'></i></div>
</div>

<div class="bottomButtons">
    <div class="bottomButton" title="Come to home page"><a href='/'><i class='home'></i></a></div>
    <div class="bottomButton" title="Fork me on Github"><a target='_blank' rel=external href='https://github.com/besstiolle/Timeline'><i class='github'></i></a></div>
    <div class="bottomButton" title='Ask me a new feature. Send me your bug description'><a target='_blank' rel=external href='https://github.com/besstiolle/Timeline/issues/new'><i class='questions'></i></a></div>
</div>

<Upload bind:openComponent={openUploadComponent} download={download}/>
<Live bind:openComponent={openLiveComponent}/>
<Online bind:openComponent={openOnlineComponent} bind:commit={commitOnlineComponent}/>
<Toast bind:this={toastComponent}/>


{#key $store}
<div id="wrapper">
    <svg viewBox="{$store.currentTimeline.viewbox}" xmlns="http://www.w3.org/2000/svg">
        <!-- http://svgicons.sparkk.fr/ -->
        <!-- https://svgedit.netlify.app/editor/index.html -->
        <!-- https://svg-stripe-generator.web.app/ -->
        <defs>
            <circle id="filler" cx="10" cy="10" fill="transparent" r="8"/>
            <path id="target"           d="M17.659,9.597h-1.224c-0.199-3.235-2.797-5.833-6.032-6.033V2.341c0-0.222-0.182-0.403-0.403-0.403S9.597,2.119,9.597,2.341v1.223c-3.235,0.2-5.833,2.798-6.033,6.033H2.341c-0.222,0-0.403,0.182-0.403,0.403s0.182,0.403,0.403,0.403h1.223c0.2,3.235,2.798,5.833,6.033,6.032v1.224c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403v-1.224c3.235-0.199,5.833-2.797,6.032-6.032h1.224c0.222,0,0.403-0.182,0.403-0.403S17.881,9.597,17.659,9.597 M14.435,10.403h1.193c-0.198,2.791-2.434,5.026-5.225,5.225v-1.193c0-0.222-0.182-0.403-0.403-0.403s-0.403,0.182-0.403,0.403v1.193c-2.792-0.198-5.027-2.434-5.224-5.225h1.193c0.222,0,0.403-0.182,0.403-0.403S5.787,9.597,5.565,9.597H4.373C4.57,6.805,6.805,4.57,9.597,4.373v1.193c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403V4.373c2.791,0.197,5.026,2.433,5.225,5.224h-1.193c-0.222,0-0.403,0.182-0.403,0.403S14.213,10.403,14.435,10.403"></path>
            <path id="mapfiller"        d="M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 "/>
            <path id="map"              d="M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 M10,17.653c-1.064-1.024-4.929-5.127-4.929-10.596c0-2.68,2.212-4.861,4.929-4.861s4.929,2.181,4.929,4.861C14.927,12.518,11.063,16.627,10,17.653 M10,3.839c-1.815,0-3.286,1.47-3.286,3.286s1.47,3.286,3.286,3.286s3.286-1.47,3.286-3.286S11.815,3.839,10,3.839 M10,9.589c-1.359,0-2.464-1.105-2.464-2.464S8.641,4.661,10,4.661s2.464,1.105,2.464,2.464S11.359,9.589,10,9.589"></path>
            <path id="b_delete"         d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
            <path id="b_up"             d="M13.889,11.611c-0.17,0.17-0.443,0.17-0.612,0l-3.189-3.187l-3.363,3.36c-0.171,0.171-0.441,0.171-0.612,0c-0.172-0.169-0.172-0.443,0-0.611l3.667-3.669c0.17-0.17,0.445-0.172,0.614,0l3.496,3.493C14.058,11.167,14.061,11.443,13.889,11.611 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.692-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.383,10c0-4.07-3.312-7.382-7.383-7.382S2.618,5.93,2.618,10S5.93,17.381,10,17.381S17.383,14.07,17.383,10"></path>
            <path id="b_down"           d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path>
            <path id="b_show"           d="M10,6.978c-1.666,0-3.022,1.356-3.022,3.022S8.334,13.022,10,13.022s3.022-1.356,3.022-3.022S11.666,6.978,10,6.978M10,12.267c-1.25,0-2.267-1.017-2.267-2.267c0-1.25,1.016-2.267,2.267-2.267c1.251,0,2.267,1.016,2.267,2.267C12.267,11.25,11.251,12.267,10,12.267 M18.391,9.733l-1.624-1.639C14.966,6.279,12.563,5.278,10,5.278S5.034,6.279,3.234,8.094L1.609,9.733c-0.146,0.147-0.146,0.386,0,0.533l1.625,1.639c1.8,1.815,4.203,2.816,6.766,2.816s4.966-1.001,6.767-2.816l1.624-1.639C18.536,10.119,18.536,9.881,18.391,9.733 M16.229,11.373c-1.656,1.672-3.868,2.594-6.229,2.594s-4.573-0.922-6.23-2.594L2.41,10l1.36-1.374C5.427,6.955,7.639,6.033,10,6.033s4.573,0.922,6.229,2.593L17.59,10L16.229,11.373z"></path>
            <path id="b_duplicate"      d="M17.391,2.406H7.266c-0.232,0-0.422,0.19-0.422,0.422v3.797H3.047c-0.232,0-0.422,0.19-0.422,0.422v10.125c0,0.232,0.19,0.422,0.422,0.422h10.125c0.231,0,0.422-0.189,0.422-0.422v-3.797h3.797c0.232,0,0.422-0.19,0.422-0.422V2.828C17.812,2.596,17.623,2.406,17.391,2.406 M12.749,16.75h-9.28V7.469h3.375v5.484c0,0.231,0.19,0.422,0.422,0.422h5.483V16.75zM16.969,12.531H7.688V3.25h9.281V12.531z"></path>
            <path id="b_add"            d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"></path>
            <path id="b_watch"          d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"></path>
            <path id="drag_right"       d="M12.522,10.4l-3.559,3.562c-0.172,0.173-0.451,0.176-0.625,0c-0.173-0.173-0.173-0.451,0-0.624l3.248-3.25L8.161,6.662c-0.173-0.173-0.173-0.452,0-0.624c0.172-0.175,0.451-0.175,0.624,0l3.738,3.736C12.695,9.947,12.695,10.228,12.522,10.4 M18.406,10c0,4.644-3.764,8.406-8.406,8.406c-4.644,0-8.406-3.763-8.406-8.406S5.356,1.594,10,1.594C14.643,1.594,18.406,5.356,18.406,10M17.521,10c0-4.148-3.374-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.147,17.521,17.521,14.147,17.521,10"></path>
            <path id="drag_left"        d="M11.739,13.962c-0.087,0.086-0.199,0.131-0.312,0.131c-0.112,0-0.226-0.045-0.312-0.131l-3.738-3.736c-0.173-0.173-0.173-0.454,0-0.626l3.559-3.562c0.173-0.175,0.454-0.173,0.626,0c0.173,0.172,0.173,0.451,0,0.624l-3.248,3.25l3.425,3.426C11.911,13.511,11.911,13.789,11.739,13.962 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.148,3.374,7.521,7.521,7.521C14.147,17.521,17.521,14.148,17.521,10"></path>
            <path id="drag_progress"    d="M10,1.75c-4.557,0-8.25,3.693-8.25,8.25c0,4.557,3.693,8.25,8.25,8.25c4.557,0,8.25-3.693,8.25-8.25C18.25,5.443,14.557,1.75,10,1.75 M10,17.382c-4.071,0-7.381-3.312-7.381-7.382c0-4.071,3.311-7.381,7.381-7.381c4.07,0,7.381,3.311,7.381,7.381C17.381,14.07,14.07,17.382,10,17.382 M7.612,10.869c-0.838,0-1.52,0.681-1.52,1.519s0.682,1.521,1.52,1.521c0.838,0,1.52-0.683,1.52-1.521S8.45,10.869,7.612,10.869 M7.612,13.039c-0.359,0-0.651-0.293-0.651-0.651c0-0.357,0.292-0.65,0.651-0.65c0.358,0,0.651,0.293,0.651,0.65C8.263,12.746,7.97,13.039,7.612,13.039 M7.629,6.11c-0.838,0-1.52,0.682-1.52,1.52c0,0.838,0.682,1.521,1.52,1.521c0.838,0,1.521-0.682,1.521-1.521C9.15,6.792,8.468,6.11,7.629,6.11M7.629,8.281c-0.358,0-0.651-0.292-0.651-0.651c0-0.358,0.292-0.651,0.651-0.651c0.359,0,0.651,0.292,0.651,0.651C8.281,7.988,7.988,8.281,7.629,8.281 M12.375,10.855c-0.838,0-1.521,0.682-1.521,1.52s0.683,1.52,1.521,1.52s1.52-0.682,1.52-1.52S13.213,10.855,12.375,10.855 M12.375,13.026c-0.358,0-0.652-0.294-0.652-0.651c0-0.358,0.294-0.652,0.652-0.652c0.357,0,0.65,0.294,0.65,0.652C13.025,12.732,12.732,13.026,12.375,13.026 M12.389,6.092c-0.839,0-1.52,0.682-1.52,1.52c0,0.838,0.681,1.52,1.52,1.52c0.838,0,1.52-0.681,1.52-1.52C13.908,6.774,13.227,6.092,12.389,6.092 M12.389,8.263c-0.36,0-0.652-0.293-0.652-0.651c0-0.359,0.292-0.651,0.652-0.651c0.357,0,0.65,0.292,0.65,0.651C13.039,7.97,12.746,8.263,12.389,8.263"></path>
            <pattern id="pattern_A" patternUnits="userSpaceOnUse" width="9.5" height="9.5" patternTransform="rotate(45)"><line x1="0" y="0" x2="5" y2="9.5" stroke="#194d33" stroke-width="1" /></pattern>
        </defs>
        <Milestones/>
        <Banner/>
        <SwimAndTasks/>
        <Today/> 
        
    </svg>
</div>
{/key}
<!--Grid/-->

<style>
:global(svg){
    font-family:"Verdana";
    font-size:8px;
}

.rightButtons{
    position: fixed;
    bottom: 0;
    right: 0;
}

.rightButton, .rightButtonDisabled, .bottomButton{
    border-radius: 50%;
    margin: 16px;
    height: 32px;
    width: 32px;
    padding: 10px;
}
.rightButton:hover, .bottomButton:hover{
    cursor:pointer;
}

.rightButton {
    border: 1px solid rgb(17, 122, 101);
    background-color: rgb(22, 160, 133);
}
.rightButton:hover{
    background-color: rgb(22, 160, 133, 0.5);
}
.rightButtonDisabled, .rightButtonDisabled:hover {
    border: 1px solid rgb(17, 122, 101, 0.5);
    background-color: rgb(22, 160, 133, 0.5);
    cursor:not-allowed;
}

.bottomButtons{
    position: fixed;
    bottom: 0;
    left:45%;
}
.bottomButton {
    border: 1px solid #cccccc;
    background-color: #ffffff;
    padding: 5px;
    display: inline-block;
}
.bottomButton:hover{
    background-color: rgb(255, 255, 255, 0.5);
}
.bottomButton a{
    border:none;
}


:global(.shouldBeHidden, .shouldBeHidden text){
    fill:#888;
}
:global(.shouldBeHidden line){
    stroke:#888;
}



.rightButtonDisabled > i{
    opacity: 0.5;
}
</style> 