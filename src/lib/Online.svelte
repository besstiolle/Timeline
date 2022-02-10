<script lang="ts">
    import { browser } from "$app/env"
    import { page } from '$app/stores';
    import { store } from './stores';
    import { Helpers } from './helpers';
    import { remove, create } from "./timelineRepository";
import Toast from "./Toast.svelte";

    let toastComponent

    export function commit(){
        if($store.lastUpdatedLocally - $store.lastCommitedRemotely > 2 * 1000){
            //console.info("gap > 2000 ms : %o", ($store.lastUpdatedLocally - $store.lastCommitedRemotely) / 1000)

            create($store.currentTimeline).then((json) => {
                $store.lastCommitedRemotely = json['message']['ts']
                if(toastComponent){
                    toastComponent.show("Saved remotely with success")
                }
            }).catch((err) => {
                console.error("Error where calling create() in Online.commit() : %o", err)
                if(toastComponent){
                    toastComponent.show("Oups, we couldn't reach the remote endpoint. Please try later.<br/> Please check your browser console for more informations. Click me to dismiss the notif", false, 0)
                }
            }).finally(()=>{
            })
        } else {
            //console.info("gap < 2000 ms : %o", ($store.lastUpdatedLocally - $store.lastCommitedRemotely) / 1000)
        }
        
        
    }

    let hidden = true
    export function openComponent(){hidden = false}   
    function handleKeydown(event) {if (!hidden && event.key === 'Escape') {closeComponent()}}
    function closeComponent(){hidden = true} 
  
    function doOffline(){

        remove($store.currentTimeline.key, $store.currentTimeline.ownerKey).then((json) => {

            $store.currentTimeline.isOnline = false
            $store.currentTimeline.ownerKey = null
            $store.currentTimeline.writeKey = null
            $store.currentTimeline.readKey = null
            $store.lastCommitedRemotely = null

            //Rewrite URL
            window.location.href= protocol + $page.host + "/g/" + $store.currentTimeline.key

        }).catch((err) => {
            console.error("Error where calling remove() in Online.doOffline() : %o", err)
            if(toastComponent){
                toastComponent.show("Oups, we couldn't reach the remote endpoint. Please try later.<br/> Please check your browser console for more informations. Click me to dismiss the notif", false, 0)
            }
        }).finally(()=>{
        })


    }
    function doOnline(){
        $store.currentTimeline.isOnline = true
        $store.currentTimeline.ownerKey = Helpers.randomeString(64)
        $store.currentTimeline.writeKey = Helpers.randomeString(64)
        $store.currentTimeline.readKey = Helpers.randomeString(64)

        create($store.currentTimeline).then((json) => {
            $store.lastCommitedRemotely = json['message']['ts']
            if(toastComponent){
                toastComponent.show("Saved remotely with success")
            }
        }).catch((err) => {
            console.error("Error where calling create() in Online.doOnline() : %o", err)
            if(toastComponent){
                toastComponent.show("Oups, we couldn't reach the remote endpoint. Please try later.<br/> Please check your browser console for more informations. Click me to dismiss the notif", false, 0)
            }
            
            $store.currentTimeline.isOnline = false
            $store.currentTimeline.ownerKey = null
            $store.currentTimeline.writeKey = null
            $store.currentTimeline.readKey = null
        }).finally(()=>{
        })
    }

    let protocol = 'https://'
    if (browser) {
        protocol = window.location.protocol + '//'
    }
    
</script>

<svelte:window on:keydown={handleKeydown}/>

<div id="shadow" class:hidden on:click={closeComponent}></div>
<form id="box" class:hidden method="post" action="" enctype="multipart/form-data">
    <div>
        {#if $store.currentTimeline.isOnline}
            <div class='warn'>Please be advice that going "<span>offline</span>" will remove every data from our server but it also cancel every previous shared link of your work</div>
            <div>You're currently : <span>ONLINE</span></div>
            <div><i class='pointer' on:click={doOffline}>Put me offline</i></div>
            <div><label for='readOnly'>Read-only URL : </label><input id='readOnly' readonly type='text' value='{protocol + $page.host + "/g/" + $store.currentTimeline.key + "?r=" + $store.currentTimeline.readKey}'></div>
            <div><label for='writer'>Writer URL : </label><input id='writer' readonly type='text' value='{protocol + $page.host + "/g/" + $store.currentTimeline.key + "?w=" + $store.currentTimeline.writeKey}'></div>
            <div><label for='owner'>Owner URL : </label><input id='owner' readonly type='text' value='{protocol + $page.host + "/g/" + $store.currentTimeline.key + "?o=" + $store.currentTimeline.ownerKey}'></div>
        {:else}
            <div class='warn'>Please be advice that bringing your charts "<span>online</span>" may allow you to save your data on our server but it also may expose your datas to everyone</div>
            <div>You're currently : <span>OFFLINE</span></div>
            <div><i class='pointer' on:click={doOnline}>Put me online</i></div>
        {/if}
        
        
        
        
    <div>Click <span class='pointer' on:click={closeComponent}>here</span> or tape <span>Escape key</span> to close this windows</div>
</form>
<Toast bind:this={toastComponent}/>

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
    }
    #box > div, #box > div > div{
        margin-top: 2vh;
    }
  
    span{
        font-weight: bold;
    }
    .pointer{
        cursor: pointer;    
    }
    input{
        width: 50vw;
    }
</style>