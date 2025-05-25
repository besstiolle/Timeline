<script lang="ts">
	import type { AboutInterface, Version } from "$lib/struct.class";
    import type { Action } from 'svelte/action';
	import { getCurrentVersion, getDistantVersion, toString, toVersion, versionCompare } from "$lib/version";
	import ShadowBox from "$lib/ShadowBox.svelte";
	import { m } from "../paraglide/messages";

    let shadowBox:ShadowBox

    let localVersion:Version = {x:0, y:0, z:0}
    let distantVersion:Version = {x:0, y:0, z:0}

    let hasMajor:boolean = false
    let hasMinor:boolean = false
    let hasFix:boolean = false
    let className = ''
    
    const myaction: Action = (node) => {

        const promiseLocalVersion = getCurrentVersion()
        const promiseDistantVersion = getDistantVersion()
        const promiseAll = [promiseDistantVersion, promiseLocalVersion]

        // Detect installed version
        promiseLocalVersion.then(responseWithMeta => {
            localVersion = toVersion((responseWithMeta.data as AboutInterface).version)
        })

        // Detect the highest version available
        promiseDistantVersion.then(gitVersions =>{
            let maxGitVersion:Version = {x:0, y:0, z:0}
            Object.keys(gitVersions).forEach(majorVersion => {
                const nextVersion:Version = toVersion(gitVersions[majorVersion].latest)
                if(maxGitVersion == undefined || versionCompare(maxGitVersion, nextVersion)){
                    maxGitVersion = nextVersion
                }
            })

            distantVersion = maxGitVersion
        })

        // Compare both versions
        Promise.all(promiseAll).then(()=>{

            // If there is an update : what is the type of update ?
            if(versionCompare(distantVersion, localVersion) > 0){
                hasMajor = localVersion.x < distantVersion.x
                hasMinor = hasMajor || localVersion.y < distantVersion.y
                hasFix = hasMinor || localVersion.z < distantVersion.z
            }

            if(hasMajor){
                className = 'major'
            } else if(hasMinor){
                className = 'minor'
            }else if(hasFix){
                className = 'fix'            
            } else {
                className = 'none'
            }
        })
    }  


</script>
{#if (hasMajor || hasMinor || hasFix)}
    <div use:myaction class="{className} cursor-pointer" 
        on:click={() => shadowBox.openComponent()} on:keydown={() => shadowBox.openComponent()} role="button" tabindex="0">

        TimeChart v{toString(localVersion)}<span class='notification'>◉</span>
    </div>
{:else}
    <div use:myaction class="{className}">
        TimeChart v{toString(localVersion)}
    </div>
{/if}

<ShadowBox bind:this={shadowBox}>
    <p>🎉 {m.version_update_available()} 🎉</p>
    {#if hasMajor}
        <p>{m.version_major()}⚠️</p>
    {/if}
    {#if hasMinor}
        <p>{m.version_minor()}🫶</p>
    {/if}
    {#if hasFix}
        <p>{m.version_fix()}🔥</p>
    {/if}
    <p class="underline"><a href='https://github.com/besstiolle/Timeline/releases/tag/v{toString(distantVersion)}'>{m.version_link_to_release()} {toString(distantVersion)}</a></p>
</ShadowBox>
<style>
    .major .notification{
        color:var(--color-red-500);
    }
    .minor .notification{
        color:var(--color-green-600);
    }
    .notification{
        animation-name: tic;
        animation-duration: 1s;
        animation-iteration-count: infinite;
        transition: none; 
    }
    @keyframes tic {
        0%   { opacity:1; }
        40%   {opacity:0; }
        100% { opacity:1; }
    }
</style>