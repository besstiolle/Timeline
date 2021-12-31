<script lang="ts">
    import { onMount } from 'svelte';
    import { Graph } from './graph.class';
    import { datas } from './stores';

    var hidden = true

    function handleClick(event) {
        if (!hidden && !document.getElementById('box').contains(event.target)){
            closeUpload()
        }
        if(hidden && document.getElementById('openUpload').contains(event.target)){
            openUpload()
        }
    }

    function handleKeydown(event) {
        if (!hidden && event.key === 'Escape') {closeUpload()}
    }

    function closeUpload(){
        hidden = true
    }

    function openUpload(){
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
                        reader.readAsText(droppedFiles[i]);
                        
                        break
                    }
                }                
            }

            function onReaderLoad(event){
                let csv : string = event.target.result;
                let elmts : string[]
                //Process file
                let newDatas : Graph.Data = new Graph.Data()
                csv.split(/\r?\n/).forEach(line => {                    
                    elmts = line.split(";")
                    if("task" == elmts[0] ){
                        newDatas.addTask(new Graph.Task(elmts[1], new Date(elmts[2]), new Date(elmts[3]),Number(elmts[4])))
                    } else if("milestone" == elmts[0] ){
                        newDatas.addMilestone(new Graph.Milestone(elmts[1], new Date(elmts[2])))
                    } 
                });
                datas.set(newDatas)

                //remove form upload part
                closeUpload()
            }

            document.getElementById('file').addEventListener('change', onChange);
            formElement.addEventListener('drop', onDrop);
        }
	});
    
  
</script>

<svelte:window on:keydown={handleKeydown} on:click="{handleClick}"/>

<button id="openUpload">
    Upload your CSV
</button>
<div id="box__shadow" class:hidden>
    <form id="box" method="post" action="" enctype="multipart/form-data">
    
    <div class="box__input">
    <div><img src='download.png' alt='Choose a CSV file or drag it here'/></div>
    <div><input class="box__file" type="file" name="files[]" accept=".csv" id="file"/>
    <label for="file"><strong>Choose a CSV file (.csv) </strong><span class="box__dragndrop"> or drag it here</span>.</label></div>
    <button class="box__button" type="submit">Upload</button>
    <div class="box__advice" on:click={closeUpload}>Click <strong>here</strong> or tape <strong>Escape key</strong> to close this windows</div>
    </div>
    <div class="box__error">Error! <span></span>.</div>

  </form>
</div>

<style>

    #box__shadow{
        height: 100%;
        width: 100%;
        background-color: rgba(200, 218, 223, 0.5);
        position: fixed;
        top:0;
        left:0;
    }
    #box{
        height: 60%;
        width: 80%;
        margin: 10%;
        font-size: 1.5rem;
        background-color: #c8dadf;
        position: relative;
        text-align:center;
    }

    .box__file {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    .box__file + label {
        max-width: 80%;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        display: inline-block;
        overflow: hidden;
    }
    .box__button {
        font-weight: 700;
        color: #e5edf1;
        background-color: #39bfd3;
        display: none;
        padding: 8px 16px;
        margin: 40px auto 0;
    }
    .box__input{
        padding: 10% 20px 0 20px;
    }
    .box__dragndrop,
    :global(.box__uploading),
    :global(.box__success),
    :global(.box__error) {
        display: none !important;
    }

    :global(#box.has-advanced-upload) {
        outline: 2px dashed #92b0b3 !important;
        outline-offset: -10px !important;
        -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear !important;
        transition: outline-offset .15s ease-in-out, background-color .15s linear !important;
    }

    :global(#box.has-advanced-upload) .box__dragndrop {
        display: inline !important;
    }

    :global(#box.is-dragover) {
        background-color: grey !important;
    }

    .box__advice{
        margin-top:2em;
        cursor: pointer;
    }

</style>