<script lang="ts">
    import toml from 'toml'

    import { store } from '../../lib/stores';
    import { FactoryTimeline } from '../../lib/factoryTimeline';
    import { goToml, timelineToObject } from '../../lib/toml';
    import { goCsv, parseCsv } from '../../lib/csv';
    import ShadowBox from '../../lib/ShadowBox.svelte';
    import Toast from '../../lib/Toast.svelte';
	import { m } from '../../paraglide/messages';
	import type { Action } from 'svelte/action';
	import { parseAbstractTimeline } from './Upload';

    const props = $props();
    const download = props.download as Function
    const BOM = new Uint8Array([0xEF,0xBB,0xBF])

    let shadowBox:ShadowBox
    let toastComponent:Toast

    export function openShadowBox(){
        shadowBox.openComponent()
    }

    function downloadCsv (event:MouseEvent|KeyboardEvent) {
        //event.preventDefault();
        const blob = new Blob([BOM, goCsv($store.currentTimeline)], {type:"data:text/csv;charset=utf-8"});
        download(blob, ".csv") 
    }

    function downloadToml (event:MouseEvent|KeyboardEvent) {
        //event.preventDefault();
        const blob = new Blob([BOM, goToml(timelineToObject($store.currentTimeline))], {type:"application/toml;charset=utf-8"})
        download(blob, ".toml") 
    }

    let _isAdvancedUpload:boolean|null = null
    function isAdvancedUpload():boolean{
        if(_isAdvancedUpload == null){
            const div = document.createElement('div')
            _isAdvancedUpload = (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
        }
        return _isAdvancedUpload as boolean
    }

    /**
     * https://svelte.dev/docs/svelte/use
     **/
    const svelteAction: Action = (node) => {
        const formElement = document.getElementById('droppable') as HTMLElement
        if (formElement && isAdvancedUpload()) {
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

            formElement.addEventListener('drop', onDrop);
            (document.getElementById('file') as HTMLElement).addEventListener('change', onChange);
        } else {
            console.warn(" not isAdvancedUpload")
        }
    }
        
    function onChange(event:Event) {
        event.preventDefault()
        let htmlElement = event.target as HTMLInputElement
        if(htmlElement.files){
            readFiles(htmlElement.files)
        }
    }

    function onDrop(event:DragEvent ) {
        event.preventDefault()
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
        $store.currentTimeline = parseAbstractTimeline($store.currentTimeline, abstractTimeline)
        toastComponent.show(m.upload_toast_upload_success({countTasks:abstractTimeline.tasks.length, countMilestones:abstractTimeline.milestones.length}),true, 5)
        shadowBox.closeComponent()
    }

    function onReaderLoadCsv(reader:FileReader){
    
        FactoryTimeline.purge($store.currentTimeline)
        let abstractTimeline = parseCsv(reader.result as string)
        $store.currentTimeline = parseAbstractTimeline($store.currentTimeline, abstractTimeline)
        toastComponent.show(m.upload_toast_upload_success({countTasks:abstractTimeline.tasks.length, countMilestones:abstractTimeline.milestones.length}),true, 5)
        shadowBox.closeComponent()
    }
  
</script>
<ShadowBox bind:this={shadowBox} id='droppable'>
    
    <!-- https://svelte.dev/docs/svelte/use -->
    <form method="post" action="" enctype="multipart/form-data" use:svelteAction>
        <div>
            <input type="file" name="files[]" accept=".csv,.toml" id="file"/>
            <label for="file"><span class='w-50 m-auto mt-2 flex gap-2 rounded-full shadow-xl/15 bg-linear-to-r/srgb from-cyan-600 to-emerald-500 hover:bg-linear-to-r/hsl hover:to-cyan-600 hover:from-emerald-500 p-3 cursor-pointer'>{m.upload_label_action()}</span> {m.upload_label_action_text()}</label>
        </div>
        <!--<button type="submit">{m.upload_action()}</button>-->
        <div><span class='w-40 m-auto mt-2 flex gap-2 rounded-full shadow-xl/15 bg-linear-to-r/srgb from-cyan-600 to-emerald-500 hover:bg-linear-to-r/hsl hover:to-cyan-600 hover:from-emerald-500 p-3 cursor-pointer' onclick={downloadCsv} onkeydown={downloadCsv} role="button" tabindex="0">{m.upload_label_download_csv_action()}</span> {m.upload_label_download_csv_action_text()}</div>
        <div><span class='w-40 m-auto mt-2 flex gap-2 rounded-full shadow-xl/15 bg-linear-to-r/srgb from-cyan-600 to-emerald-500 hover:bg-linear-to-r/hsl hover:to-cyan-600 hover:from-emerald-500 p-3 cursor-pointer' onclick={downloadToml} onkeydown={downloadToml} role="button" tabindex="0">{m.upload_label_download_toml_action()}</span> {m.upload_label_download_toml_action_text()}</div>
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
</style>