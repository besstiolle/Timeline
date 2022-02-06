<script lang="ts">
    import { onMount } from 'svelte';
    import { Struct } from './struct.class';
    import { store } from './stores';
    import { FactoryTimeline } from './factoryTimeline';
    import { FactorySwimline } from './factorySwimline';

    let hidden = true

    function handleKeydown(event) {
        if (!hidden && event.key === 'Escape') {closeUpload()}
    }

    function closeUpload(){
        hidden = true
    }

    export function openUpload(){
        hidden = false
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
                    if(droppedFiles[i]['name'].endsWith('.csv') || droppedFiles[i]['name'].endsWith('.toml')){
                                            
                        let reader = new FileReader();
                        reader.onload = onReaderLoad;
                        reader.readAsText(droppedFiles[i], );
                        
                        break
                    }
                }                
            }

            function onReaderLoad(event){
                let elmts : string[]
                let label: string
                let isShow : boolean
                let start : string
                let end : string
                let progress: number
                let swimline: string
                let previousSwimline: string
                let previousSwimlineId: number

                FactoryTimeline.purge($store.currentTimeline)

                //Process file
                //TODO : guessing encoding
                // https://guillim.github.io/javascript/2020/08/28/csv-encoding-detection-javascript.html
                let id: number = 0
                event.target.result.split(/\r?\n/).forEach((line: string) => {                    
                    elmts = line.split(";")
                    if("task" == elmts[0] || "milestone" == elmts[0]) {
                        label = elmts[1]
                        isShow = (elmts[2] === "TRUE" || elmts[2] === "true") //FIXME prévoir regex
                        start = elmts[3]
                        if("task" == elmts[0] ){
                            end = elmts[4]
                            progress = Number(elmts[5])
                            swimline = elmts[6]
                            if(swimline !== "" && previousSwimline == swimline){
                                //reuse id of previous swimline
                            } else if(swimline !== "" && previousSwimline != swimline) {
                                // create new swimline and save its id
                                previousSwimlineId = FactorySwimline.create($store.currentTimeline,swimline)
                            } else {
                                //reset previous Swimline id
                                previousSwimlineId = null
                            }
                            FactoryTimeline.addTask($store.currentTimeline, new Struct.Task(id, label, start, end, progress, isShow, swimline, previousSwimlineId))

                            previousSwimline = swimline
                        } else if("milestone" == elmts[0] ){
                            FactoryTimeline.addMilestone($store.currentTimeline, new Struct.Milestone(id, label, start, isShow))
                        } 
                        id = $store.currentTimeline.getNextId()
                    }
                });
                $store.currentTimeline.tasks = $store.currentTimeline.tasks
                //remove form upload part
                closeUpload()
            }

            document.getElementById('file').addEventListener('change', onChange);
            formElement.addEventListener('drop', onDrop);
        }
	});
    
  
</script>

<svelte:window on:keydown={handleKeydown}/>

<div id="shadow" class:hidden on:click={closeUpload}></div>
<form id="box" class:hidden method="post" action="" enctype="multipart/form-data">
    <div>
        <input type="file" name="files[]" accept=".csv" id="file"/>
        <label for="file"><span class='pointer'>Choose a CSV file (.csv) </span> or drag it here.</label>
    </div>
    <button type="submit">Upload</button>
    <div>Click <span class='pointer' on:click={closeUpload}>here</span> or tape <span>Escape key</span> to close this windows</div>
</form>

<style>

    #shadow{
        height: 100%;
        width: 100%;
        background-color: rgba(200, 218, 223, 0.5);
        position: fixed;
        top:0;
        left:0;
    }
    #box{
        height: 80%;
        max-height: 80%;
        width: 90%;
        font-size: 1.5rem;
        background-color: #c8dadf;
        position: absolute;
        text-align: center;
        top: 10%;
        left: 5%;
        line-height: 3em;
        outline: 2px dashed #92b0b3 !important;
        outline-offset: -10px !important;
    }
    #box > div:first-child{
        margin-top: 10%;
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