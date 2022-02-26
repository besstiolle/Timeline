<script lang="ts">
import toml from 'toml'

import { onMount } from 'svelte';

import { store } from './stores';
import { Struct } from './struct.class';
import { FactoryTimeline } from './factoryTimeline';
import { FactorySwimline } from './factorySwimline';
import { goToml, timelineToObject } from './toml';
import { goCsv } from './csv';


export let download
let hidden = true
export function openComponent(){hidden = false}   
function handleKeydown(event) {if (!hidden && event.key === 'Escape') {closeComponent()}}
function closeComponent(){hidden = true} 

const BOM = new Uint8Array([0xEF,0xBB,0xBF])

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


    let formElement = document.getElementById('box');
    if (isAdvancedUpload) {
        formElement.classList.add('has-advanced-upload');

        let funcDrag = function(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        let funcDragOver = function(e) {
            formElement.classList.add('is-dragover');
        }
        let funcDragLeave = function(e) {
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

        
        function onChange(event) {
            readFiles(event.target.files)
        }

        function onDrop(event) {
            readFiles(event.dataTransfer.files)
        }

        function readFiles(droppedFiles : FileList) {
            for(let i = 0; i < droppedFiles.length; i++){
                if(droppedFiles[i]['name'].endsWith('.csv')){
                    let reader = new FileReader()
                    reader.onload = onReaderLoadCsv
                    reader.readAsText(droppedFiles[i])
                    break
                }
                if(droppedFiles[i]['name'].endsWith('.toml')){
                    let reader = new FileReader()
                    reader.onload = onReaderLoadToml
                    reader.readAsText(droppedFiles[i])
                    break
                }
            }                
        }

        function onReaderLoadToml(event){
            
            FactoryTimeline.purge($store.currentTimeline)
            let abstractTimeline = toml.parse(event.target.result)
            parseAbstractTimeline(abstractTimeline)
            //close windows
            closeComponent()
        }

        function onReaderLoadCsv(event){
            let elmts : string[]

            FactoryTimeline.purge($store.currentTimeline)

            //Process file
            //TODO add more controls
            let abstractTimeline = {tasks:[], milestones:[]}
            event.target.result.split(/\r?\n/).forEach((line: string) => {                    
                elmts = line.split(";")
                if ("version" == elmts[0]) {
                    abstractTimeline['version'] = elmts[1]
                }
                if ("title" == elmts[0]) {
                    abstractTimeline['title'] = elmts[1]
                }
                if ("task" == elmts[0]) {
                    abstractTimeline.tasks.push({
                        label:elmts[1],
                        show:(elmts[2] === "TRUE" || elmts[2] === "true"),
                        start:elmts[3],
                        end:elmts[4],
                        progress:Number(elmts[5]),
                        swimline:elmts[6],
                    })
                }
                if ("milestone" == elmts[0]) {
                    abstractTimeline.milestones.push({
                        label:elmts[1],
                        show:(elmts[2] === "TRUE" || elmts[2] === "true"),
                        date:elmts[3],
                    })
                }
            })
            
            parseAbstractTimeline(abstractTimeline)
            //close windows
            closeComponent()
        }

        function parseAbstractTimeline(abstractTimeline:Object){
            if(abstractTimeline['title']){
                $store.currentTimeline.title = abstractTimeline['title']
            }
            if(abstractTimeline['version']){
                //Nothing right now
            }
            if(abstractTimeline['tasks']){
                
                let previousSwimline: string
                let previousSwimlineId: number

                abstractTimeline['tasks'].forEach(abstractTask => {

                    if(abstractTask.swimline !== "" && previousSwimline == abstractTask.swimline){
                        //reuse id of previous swimline
                    } else if(abstractTask.swimline !== "" && previousSwimline != abstractTask.swimline) {
                        // create new swimline and save its id
                        previousSwimlineId = FactorySwimline.create($store.currentTimeline, abstractTask.swimline)
                    } else {
                        //reset previous Swimline id
                        previousSwimlineId = null
                    }

                    FactoryTimeline.addTask($store.currentTimeline, 
                        new Struct.Task($store.currentTimeline.getNextId(), 
                                        abstractTask.label, 
                                        abstractTask.start, 
                                        abstractTask.end, 
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

        document.getElementById('file').addEventListener('change', onChange);
        formElement.addEventListener('drop', onDrop);
    }
});

  
</script>

<svelte:window on:keydown={handleKeydown}/>

<div id="shadow" class:hidden on:click={closeComponent}></div>
<form id="box" class:hidden method="post" action="" enctype="multipart/form-data">
    <div>
        <input type="file" name="files[]" accept=".csv,.toml" id="file"/>
        <label for="file"><span class='pointer'>Choose a Csv/Toml file (.csv or .toml extension) </span> or drag it here.</label>
    </div>
    <button type="submit">Upload</button>
    <div><span class='pointer' on:click={closeComponent}>Click here</span> or tape <span>Escape key</span> to close this windows</div>
    <div><span class='pointer' on:click={downloadCsv}>Click here</span> to download your datas in a CSV format</div>
    <div><span class='pointer' on:click={downloadToml}>Click here</span> to download your datas in a Toml format</div>
</form>

<style>

    #shadow{
        height: 100vh;
        width: 100vw;
        background-color: rgba(200, 218, 223, 0.5);
        position: fixed;
        top:0;
        left:0;
    }
    #box{
        height: 80vh;
        max-height: 80vh;
        width: 90vw;
        font-size: 1.5rem;
        background-color: #c8dadf;
        position: absolute;
        text-align: center;
        top: 10vh;
        left: 5vw;
        outline: 2px dashed #92b0b3 !important;
        outline-offset: -10px !important;
        position: fixed;
        line-height: 3em;
    }
        
    #box > div:first-child{
        margin-top: 10vh;
    }
  
    :global(#box.has-advanced-upload) {
        -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear !important;
        transition: outline-offset .15s ease-in-out, background-color .15s linear !important;
    }

    :global(#box.is-dragover) {
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
    .pointer{
        cursor: pointer;    
    }
</style>