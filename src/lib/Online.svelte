<script lang="ts">
    
import { page } from '$app/state';
import { store } from './stores';

import { Helpers } from './helpers';
import { remove, create } from "./timelineRepository";
import ShadowBox from './ShadowBox.svelte';
import Toast from './Toast.svelte';
import { Rights } from './rights.class';
import { FactoryCards } from './factoryCards';
	import type { ResponseWithMeta } from '../routes/api/timeline/types';
	import { m } from '../paraglide/messages';

    let toastComponent:Toast
    let shadowBox:ShadowBox
    
    export function openShadowBox(){
        shadowBox.openComponent()
    }
    export function commit(){
        
        if($store.lastUpdatedLocally !== null && $store.lastCommitedRemotely !== null 
                && $store.lastUpdatedLocally - $store.lastCommitedRemotely > 5000){
            $store.commitInProgress = true
            console.info($store.lastUpdatedLocally , $store.lastCommitedRemotely)
            console.debug("gap > 5000 ms : %o", ($store.lastUpdatedLocally - $store.lastCommitedRemotely))
            create($store.currentTimeline).then((responseWithMeta:ResponseWithMeta) => {
                $store.lastCommitedRemotely = responseWithMeta.meta.ts
                if(toastComponent){
                    toastComponent.show(m.online_toast_saved_success())
                }
            }).catch((err) => {
                console.error("Error where calling create() in Online.commit() : %o", err)
                if(toastComponent){
                    toastComponent.show(m.online_toast_remote_offline(), false, 0)
                }
            }).finally(()=>{
                
                $store.commitInProgress = false
            })
        } else {
            console.debug("gap < 5000 ms : %o", ($store.lastUpdatedLocally - $store.lastCommitedRemotely))
        }        
    }

    const base_url = page.url.protocol + '//' + page.url.host
 
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
                toastComponent.show(m.online_toast_remote_offline(), false, 0)
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

        create($store.currentTimeline).then((responseWithMeta:ResponseWithMeta) => {
            $store.lastCommitedRemotely = responseWithMeta.meta.ts
            if(toastComponent){
                toastComponent.show(m.online_toast_saved_success())
            }
            //Refresh internal Rights value
            $store.rights = new Rights($store.currentTimeline.ownerKey)
             
        }).catch((err) => {
            console.error("Error where calling create() in Online.doOnline() : %o", err)
            if(toastComponent){
                toastComponent.show(m.online_toast_remote_offline(), false, 0)
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
        <div class='warn'>{m.online_warn_before_offline_0()} "<span>{m.online_warn_before_offline_1()}</span>" {m.online_warn_before_offline_2()}</div>
        <div>{m.online_status()} : <span>{m.online_status_online()}</span></div>
        <div class='action' on:click={doOffline} on:keydown={doOffline} role="button" tabindex="0">{m.online_action_offline()}</div>
        <div><label for='readOnly'>{m.online_readonly()} : </label><input id='readOnly' readonly type='text' value='{base_url + "/g/" + $store.currentTimeline.key + "?r=" + $store.currentTimeline.readKey}'></div>
        <div><label for='writer'>{m.online_writer()} : </label><input id='writer' readonly type='text' value='{base_url + "/g/" + $store.currentTimeline.key + "?w=" + $store.currentTimeline.writeKey}'></div>
        <div><label for='owner'>{m.online_owner()} : </label><input id='owner' readonly type='text' value='{base_url + "/g/" + $store.currentTimeline.key + "?o=" + $store.currentTimeline.ownerKey}'></div>
    {:else}
        <div class='warn'>{m.online_warn_before_online_0()} "<span>{m.online_warn_before_online_1()}</span>" {m.online_warn_before_online_0()}</div>
        <div>{m.online_status()} : <span>{m.online_status_offline()}</span></div>
        <div class='action' on:click={doOnline} on:keydown={doOnline} role="button" tabindex="0">{m.online_action_online()}</div>
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