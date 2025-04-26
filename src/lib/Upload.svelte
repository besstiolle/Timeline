<script lang="ts">
import toml from 'toml'

import { onMount } from 'svelte';

import { store } from './stores';
import { Struct, type abstractMilestoneInterface, type abstratTaskInterface as abstractTaskInterface, type abstractTimelineInterface } from './struct.class';
import { FactoryTimeline } from './factoryTimeline';
import { FactorySwimline } from './factorySwimline';
import { goToml, timelineToObject } from './toml';
import { goCsv } from './csv';
import ShadowBox from './ShadowBox.svelte';
import Toast from './Toast.svelte';


export let download = (blob:Blob, extension:string) => {}
const BOM = new Uint8Array([0xEF,0xBB,0xBF])

let shadowBox:ShadowBox
let toastComponent:Toast

export function openShadowBox(){
    shadowBox.openComponent()
}

function downloadCsv () {
    const blob = new Blob([BOM, goCsv($store.currentTimeline)], {type:"data:text/csv;charset=utf-8"});
    download(blob, ".csv") 
}

function downloadToml () {
    const blob = new Blob([BOM, goToml(timelineToObject($store.currentTimeline))], {type:"application/toml;charset=utf-8"})
    download(blob, ".toml") 
}


onMount(async () => {
    let isAdvancedUpload = function() {
        let div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();


    let formElement = document.getElementById('droppable') as HTMLElement
    if (isAdvancedUpload) {
        formElement.classList.add('has-advanced-upload');

        let funcDrag = function(e:Event) {
            e.preventDefault();
            e.stopPropagation();
        }
        let funcDragOver = function(e:Event) {
            formElement.classList.add('is-dragover');
        }
        let funcDragLeave = function(e:Event) {
            formElement.classList.remove('is-dragover');
        }

        formElement.addEventListener('drag', funcDrag)
        formElement.addEventListener('dragstart', funcDrag)
        formElement.addEventListener('dragend', funcDrag)
        formElement.addEventListener('dragover', funcDrag)
        formElement.addEventListener('dragenter', funcDrag)
        formElement.addEventListener('dragleave', funcDrag)
        formElement.addEventListener('drop', funcDrag)

        formElement.addEventListener('dragover', funcDragOver)
        formElement.addEventListener('dragenter', funcDragOver)

        formElement.addEventListener('dragleave', funcDragLeave)
        formElement.addEventListener('dragend', funcDragLeave)
        formElement.addEventListener('drop', funcDragLeave)

        
        function onChange(event:Event) {
            let htmlElement = event.target as HTMLInputElement
            if(htmlElement.files){
                readFiles(htmlElement.files)
            }
        }

        function onDrop(event:DragEvent ) {
            if(event.dataTransfer){
                readFiles(event.dataTransfer.files)
            }
        }

        function readFiles(droppedFiles : FileList) {
            for(let i = 0; i < droppedFiles.length; i++){
                if(droppedFiles[i]['name'].endsWith('.csv')){
                    let reader = new FileReader()
                    reader.onload = () =>{
                        onReaderLoadCsv(reader)
                    }
                    reader.readAsText(droppedFiles[i])
                    break
                }
                if(droppedFiles[i]['name'].endsWith('.toml')){
                    let reader = new FileReader()
                    reader.onload = () =>{
                        onReaderLoadToml(reader)
                    }
                    reader.readAsText(droppedFiles[i])
                    break
                }
            }                
        }

        function onReaderLoadToml(reader:FileReader){
            
            FactoryTimeline.purge($store.currentTimeline)
            let abstractTimeline = toml.parse(reader.result as string)
            parseAbstractTimeline(abstractTimeline)
            //Show resume
            toastComponent.show(`imported  ${abstractTimeline.tasks.length} tasks and ${abstractTimeline.milestones.length} milestones with success`,true, 5)
            //close windows
            shadowBox.closeComponent()
        }

        function onReaderLoadCsv(reader:FileReader){
            let elmts : string[]

            FactoryTimeline.purge($store.currentTimeline)

            //Process file
            //TODO add more controls
            let abstractTasks:abstractTaskInterface[] = []
            let abstractMilestones:abstractMilestoneInterface[] = []
            let abstractTimeline:abstractTimelineInterface = {tasks:abstractTasks, milestones:abstractMilestones,title:'', version:''};

            (reader.result as string).split(/\r?\n/).forEach((line: string) => {                    
                elmts = line.split(";")
                if ("version" == elmts[0]) {
                    abstractTimeline['version'] = elmts[1]
                }
                if ("title" == elmts[0]) {
                    abstractTimeline['title'] = elmts[1]
                }
                if ("task" == elmts[0]) {
                    if(abstractTimeline['version'] === "1.0") {
                        abstractTimeline.tasks.push({
                            label:elmts[1],
                            isShow:(elmts[2] === "TRUE" || elmts[2] === "true"),
                            start:elmts[3],
                            end:elmts[4],     
                            hasProgress:true,                 
                            progress:Number(elmts[5]),
                            swimline:elmts[6],
                        })
                    } else if(abstractTimeline['version'] === "1.1") {
                        abstractTimeline.tasks.push({
                            label:elmts[1],
                            isShow:(elmts[2] === "TRUE" || elmts[2] === "true"),
                            start:elmts[3],
                            end:elmts[4],     
                            hasProgress:(elmts[2] === "TRUE" || elmts[2] === "true"),                 
                            progress:Number(elmts[6]),
                            swimline:elmts[7],
                        })
                    } else {
                        console.error("incorrect version of the CSV detected")
                    }
                }
                if ("milestone" == elmts[0]) {
                    let abstractMilestone:abstractMilestoneInterface = {
                        label:elmts[1],
                        isShow:(elmts[2] === "TRUE" || elmts[2] === "true"),
                        date:elmts[3],
                    }
                    abstractTimeline.milestones.push(abstractMilestone)
                }
            })
            
            parseAbstractTimeline(abstractTimeline)
            //Show resume
            toastComponent.show(`imported  ${abstractTimeline.tasks.length} tasks and ${abstractTimeline.milestones.length} milestones with success`)
            //close windows
            shadowBox.closeComponent()
        }

        function parseAbstractTimeline(abstractTimeline:abstractTimelineInterface){
            if(abstractTimeline.title){
                $store.currentTimeline.title = abstractTimeline['title']
            }
            if(abstractTimeline.version){
                //Nothing right now
            }
            if(abstractTimeline.tasks){
                
                let previousSwimline: string
                let previousSwimlineId: number

                abstractTimeline.tasks.forEach(abstractTask => {

                    if(abstractTask.swimline !== "" && previousSwimline == abstractTask.swimline){
                        //reuse id of previous swimline
                    } else if(abstractTask.swimline !== "" && previousSwimline != abstractTask.swimline) {
                        // create new swimline and save its id
                        previousSwimlineId = FactorySwimline.create($store.currentTimeline, abstractTask.swimline)
                    } else {
                        //reset previous Swimline id
                        previousSwimlineId = -1
                    }

                    FactoryTimeline.addTask($store.currentTimeline, 
                        new Struct.Task($store.currentTimeline.getNextId(), 
                                        abstractTask.label, 
                                        abstractTask.start, 
                                        abstractTask.end, 
                                        abstractTask.hasProgress === false?abstractTask.hasProgress:true,
                                        abstractTask.progress, 
                                        abstractTask.isShow === false?abstractTask.isShow:true, 
                                        abstractTask.swimline, 
                                        previousSwimlineId,
                                    ))
                    
                    previousSwimline = abstractTask.swimline
                });
            }
            if(abstractTimeline['milestones']){
                abstractTimeline['milestones'].forEach(abstractMilestone => {
                    FactoryTimeline.addMilestone($store.currentTimeline, 
                        new Struct.Milestone($store.currentTimeline.getNextId(), 
                                            abstractMilestone.label, 
                                            abstractMilestone.date, 
                                            abstractMilestone.isShow === false?abstractMilestone.isShow:true, 
                                        ))
                });
            }

            $store.currentTimeline = $store.currentTimeline
        }

        (document.getElementById('file') as HTMLElement).addEventListener('change', onChange);
        formElement.addEventListener('drop', onDrop);
    }
});

  
</script>
<ShadowBox bind:this={shadowBox} id='droppable'>

    <form method="post" action="" enctype="multipart/form-data">
        <div>
            <input type="file" name="files[]" accept=".csv,.toml" id="file"/>
            <label for="file"><span class='action'>upload file</span> Must be a .csv or .toml file. You can also drag it over this windows.</label>
        </div>
        <button type="submit">Upload</button>
        <div><span class='action' on:click={downloadCsv} on:keydown={downloadCsv} role="button" tabindex="0">download .csv</span> The CSV format is very simple and can be edited in Excel or Notepad++ & co</div>
        <div><span class='action' on:click={downloadToml} on:keydown={downloadToml} role="button" tabindex="0">download .toml</span> The Toml format can be extended in the futur and can be edited with Notepad++ & co</div>
    </form>
</ShadowBox>
<Toast bind:this={toastComponent}/>

<style>
  
    :global(#droppable.has-advanced-upload) {
        -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear !important;
        transition: outline-offset .15s ease-in-out, background-color .15s linear !important;
    }

    :global(#droppable.is-dragover) {
        background-color: grey !important;
    }

    input {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    button {
        font-weight: 700;
        color: #e5edf1;
        background-color: #39bfd3;
        display: none;
        padding: 8px 16px;
        margin: 40px auto 0;
    }
    span{
        font-weight: bold;
    }
    
    .action{
        background-color: rgb(22, 160, 133, 1);
        display: inline-block;
        padding: 1vh 2vw;
        margin: 2vh;
        cursor: pointer;
    }
</style>