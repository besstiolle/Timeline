<script lang="ts">
    
import { page } from '$app/stores';
import { store } from './stores';

import { Helpers } from './helpers';
import { remove, create } from "./timelineRepository";
import ShadowBox from './ShadowBox.svelte';
import Toast from './Toast.svelte';
import { Rights } from './rights.class';
import { FactoryCards } from './factoryCards';

    let toastComponent:Toast
    let shadowBox:ShadowBox
    
    export function openShadowBox(){
        shadowBox.openComponent()
    }
    export function commit(){
        
        if($store.lastUpdatedLocally !== null && $store.lastCommitedRemotely !== null 
                && $store.lastUpdatedLocally - $store.lastCommitedRemotely > 2 * 1000){
            $store.commitInProgress = true
            console.debug("gap > 2000 ms : %o", ($store.lastUpdatedLocally - $store.lastCommitedRemotely) / 1000)
            create($store.currentTimeline).then((createResponseJson) => {
                $store.lastCommitedRemotely = createResponseJson.message.ts
                if(toastComponent){
                    toastComponent.show("Saved remotely with success")
                }
            }).catch((err) => {
                console.error("Error where calling create() in Online.commit() : %o", err)
                if(toastComponent){
                    toastComponent.show("Oups, we couldn't reach the remote endpoint. Please try later.<br/> Please check your browser console for more informations. Click me to dismiss the notif", false, 0)
                }
            }).finally(()=>{
                
                $store.commitInProgress = false
            })
        } else {
            console.debug("gap < 2000 ms : %o", ($store.lastUpdatedLocally - $store.lastCommitedRemotely) / 1000)
        }        
    }

    const base_url = $page.url.protocol + '//' + $page.url.host
 
    function doOffline(){

        let ownerKey = $store.currentTimeline.ownerKey
        if(ownerKey == null) {ownerKey = ''}
        let seachParams = new URLSearchParams([['key', $store.currentTimeline.key], ['ownerKey', ownerKey]])
        remove(seachParams).then((json) => {

            $store.currentTimeline.isOnline = false
            $store.currentTimeline.ownerKey = null
            $store.currentTimeline.writeKey = null
            $store.currentTimeline.readKey = null
            $store.lastCommitedRemotely = -1

            //Rewrite URL
            window.location.href = base_url + "/g/" + $store.currentTimeline.key

        }).catch((err) => {
            console.error("Error where calling remove() in Online.doOffline() : %o", err)
            if(toastComponent){
                toastComponent.show("Oups, we couldn't reach the remote endpoint. Please try later.<br/> Please check your browser console for more informations. Click me to dismiss the notif", false, 0)
            }
        }).finally(()=>{
        })

        //update cards with the online/offline information
        FactoryCards.updateCardsWithTimeline($store.cards, $store.currentTimeline)
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
            //Refresh internal Rights value
            $store.rights = new Rights($store.currentTimeline.ownerKey)
             
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

        //update cards with the online/offline information
        FactoryCards.updateCardsWithTimeline($store.cards, $store.currentTimeline)
    }
    
</script>


<ShadowBox bind:this={shadowBox}>
    {#if $store.currentTimeline.isOnline}
        <div class='warn'>Please be advice that going "<span>offline</span>" will remove every data from our server but it also cancel every previous shared link of your work</div>
        <div>You're currently : <span>ONLINE</span></div>
        <div class='action' on:click={doOffline} on:keydown={doOffline}>Put me offline</div>
        <div><label for='readOnly'>Read-only URL : </label><input id='readOnly' readonly type='text' value='{base_url + "/g/" + $store.currentTimeline.key + "?r=" + $store.currentTimeline.readKey}'></div>
        <div><label for='writer'>Writer URL : </label><input id='writer' readonly type='text' value='{base_url + "/g/" + $store.currentTimeline.key + "?w=" + $store.currentTimeline.writeKey}'></div>
        <div><label for='owner'>Owner URL : </label><input id='owner' readonly type='text' value='{base_url + "/g/" + $store.currentTimeline.key + "?o=" + $store.currentTimeline.ownerKey}'></div>
    {:else}
        <div class='warn'>Please be advice that bringing your charts "<span>online</span>" may allow you to save your data on our server but it also may expose your datas to everyone</div>
        <div>You're currently : <span>OFFLINE</span></div>
        <div class='action' on:click={doOnline} on:keydown={doOnline}>Put me online</div>
    {/if}
</ShadowBox>
<Toast bind:this={toastComponent}/>

<style>
    .action{
        background-color: rgb(22, 160, 133, 1);
        display: inline-block;
        padding: 1vh 2vw;
        margin: 2vh;
        cursor: pointer;
    }
    input{
        width: 50vw;
    }
</style>