
<script lang="ts">
import { LOCAL_STORAGE } from "$lib/constantes";
import { CustomLocalStorage } from "$lib/customLocalStorage";
import { FactoryCards } from "$lib/factoryCards";
import { FactoryPicto } from "$lib/factoryPicto";

import { Helpers } from "$lib/helpers";
import PopUpConfirmation from "$lib/PopUpConfirmation.svelte";
	import { Rights } from "$lib/rights.class";
import { store } from "$lib/stores";
import { Struct } from "$lib/struct.class";
import Toast from "$lib/Toast.svelte";

let popUpComponent:PopUpConfirmation
let toastComponent:Toast
//Reset store currentTimeline information when we are here
$store.currentTimeline=new Struct.Timeline()
$store.lastCommitedRemotely=-1
$store.lastUpdatedLocally=-1
$store.rights=new Rights(null)

function toStringDate(date: Date): string {
	const DATE_SEPARATOR = "/"
	const HOUR_SEPARATOR = "h"
	const SPACE_SEPARATOR = " "
	return date.getDate().toString().padStart(2, '0') 
		+ DATE_SEPARATOR + (date.getMonth() + 1).toString().padStart(2, '0') 
		+ SPACE_SEPARATOR + date.getHours().toString().padStart(2, '0') 
		+ HOUR_SEPARATOR + date.getMinutes().toString().padStart(2, '0') 
}


function gotoNew(){
	window.location.href = '/g/' + Helpers.randomeString(64)
}

function goto(event:Event|null, key:string){
	window.location.href = '/g/' + key
}

/**
 * Called to duplicate a existing chart
 * @param event 
 * @param key the key of the chart user want to duplicate.
 */
function duplicate(event:Event, key:string):void {
	event.stopPropagation();
	let clone:Struct.Timeline = structuredClone(CustomLocalStorage.getTimeline(key))
	clone.ownerKey=null
	clone.writeKey=null
	clone.readKey=null
	clone.isOnline=false
	clone.title = generateTitle(clone['title'])
	clone.key = Helpers.randomeString(64)

	let newCard = new Struct.Card(clone['key'], clone['title'])
	$store.cards.push(newCard)
	CustomLocalStorage.save(clone['key'], clone)
	//refresh store
	$store.currentTimeline=new Struct.Timeline('','')
}

/**
 * Generate a new title with unique extension like [0-9]
 * @param title the original title 
 */
function generateTitle(title:string):string{
	let index = 1
	while(true){
		if(FactoryCards.getFirstIndexByTitle($store.cards, title +  ' [' + index + ']') !== null){
			index++
		} else {
			break
		}
	}
	return title +  ' [' + index + ']'
}

/**
 * Show popup to ask user if he really want to delete a chart
 * @param event
 * @param key
 */
function askDelete(event:Event, key:string):void{
	event.stopPropagation();
	let timelineToDelete: Struct.Timeline = CustomLocalStorage.getTimeline(key)
	if(timelineToDelete && timelineToDelete.isOnline){
		console.warn(`this chart "${timelineToDelete.title}" is online and can't be deleted`)
		toastComponent.show(`this chart "${timelineToDelete.title}" is online and can't be deleted`,false, 5)
		return
	}
	popUpComponent.show("Are you sure you want to delete this chart ? This operation cannot be undone.", doDelete , "Confirm deletion", [key], doNotDelete, "Cancel", [])
	
}

/**
 * Callback called if the user cancel the delete action
 *  Nothing will happen
 * @param args
 */
function doNotDelete(args:any[]){
	//Nothing more to do
}

/**
 * Callback called if the user confirme the delete action
 *  The chart will be deleted
 *  The cards will be refresh without the cart deleted
 *  The picto will be deleted
 * @param args
 */
function doDelete(args:any[]):void{
	let key=args[0]

	let timelineToDelete: Struct.Timeline = CustomLocalStorage.getTimeline(key)
	if(timelineToDelete && timelineToDelete.isOnline){
		console.warn(`this chart "${timelineToDelete.title}" is online and can't be deleted`)
		toastComponent.show(`this chart "${timelineToDelete.title}" is online and can't be deleted`,false, 5)
		return
	}
	CustomLocalStorage.remove(key)
	let index = FactoryCards.getIndexByKey($store.cards, key)
	if(index !== null){
		$store.cards.splice(index,1)
	}
	
	CustomLocalStorage.remove(LOCAL_STORAGE.KEY_PICTO + key)
	//refresh store
	$store.currentTimeline=new Struct.Timeline('','')
}


/**
 * Retrive the picto from localStorage with the timeline's key 
 * @param key
 */
 function getThumbnail(key:string):string{
	let thumbnail = FactoryPicto.getPicto(key)	
	if(thumbnail == null){
		thumbnail = '/notFound.webp'
	}
	return thumbnail
 }

</script>

<svelte:head>
	<title>Timeline Charts</title>
</svelte:head>

<defs>
	<circle id="filler" cx="10" cy="10" fill="transparent" r="8"/>
	<path id="b_down"           d="M17.659,9.597h-1.224c-0.199-3.235-2.797-5.833-6.032-6.033V2.341c0-0.222-0.182-0.403-0.403-0.403S9.597,2.119,9.597,2.341v1.223c-3.235,0.2-5.833,2.798-6.033,6.033H2.341c-0.222,0-0.403,0.182-0.403,0.403s0.182,0.403,0.403,0.403h1.223c0.2,3.235,2.798,5.833,6.033,6.032v1.224c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403v-1.224c3.235-0.199,5.833-2.797,6.032-6.032h1.224c0.222,0,0.403-0.182,0.403-0.403S17.881,9.597,17.659,9.597 M14.435,10.403h1.193c-0.198,2.791-2.434,5.026-5.225,5.225v-1.193c0-0.222-0.182-0.403-0.403-0.403s-0.403,0.182-0.403,0.403v1.193c-2.792-0.198-5.027-2.434-5.224-5.225h1.193c0.222,0,0.403-0.182,0.403-0.403S5.787,9.597,5.565,9.597H4.373C4.57,6.805,6.805,4.57,9.597,4.373v1.193c0,0.222,0.182,0.403,0.403,0.403s0.403-0.182,0.403-0.403V4.373c2.791,0.197,5.026,2.433,5.225,5.224h-1.193c-0.222,0-0.403,0.182-0.403,0.403S14.213,10.403,14.435,10.403"></path>
	<path id="b_delete"         d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
	<path id="b_duplicate"      d="M17.391,2.406H7.266c-0.232,0-0.422,0.19-0.422,0.422v3.797H3.047c-0.232,0-0.422,0.19-0.422,0.422v10.125c0,0.232,0.19,0.422,0.422,0.422h10.125c0.231,0,0.422-0.189,0.422-0.422v-3.797h3.797c0.232,0,0.422-0.19,0.422-0.422V2.828C17.812,2.596,17.623,2.406,17.391,2.406 M12.749,16.75h-9.28V7.469h3.375v5.484c0,0.231,0.19,0.422,0.422,0.422h5.483V16.75zM16.969,12.531H7.688V3.25h9.281V12.531z"></path>
</defs>

<div id="search">
	<div id='label'>Would you like to come back to your creations ?</div>
	<div id='create'>Or <button on:click={gotoNew}>create</button> a new one !</div>
</div>
{#key $store.cards}
<div id='current'>
	{#each $store.cards as card}
		<div class='card' on:click={() => goto(null, card.key)} on:keydown={() => goto(null, card.key)} role="button" tabindex="0">
			<img src={getThumbnail(card.key)} alt='miniature ' height="150px" width="250px" class='thumbnail'/>
			<div class='title' >{card.title}</div>
			<div class='lastUpdate'>Updated : {#if card.lastUpdated}{toStringDate(card.lastUpdated)}{/if}</div>
			<div class:hidden={!card.isOnline} class='information' title="This Timeline is saved remotely and can't be deleted">
				<i class="online"></i>
			</div>
			<div class='action'>
				<small>{card.key.substring(0,5)}</small>
				<div class="live_cmd" on:click={(event) => duplicate(event, card.key)} on:keydown={(event) => duplicate(event, card.key)} title="duplicate this Timeline"  role="button" tabindex="0">
					<svg viewBox="0 0 20 20">
						<use x="0" y="0" href="#b_duplicate"/>
					</svg>
				</div>
				<div class:hidden={card.isOnline} class="live_cmd live_cmd_red" on:click={(event) => askDelete(event, card.key)} on:keydown={(event) => askDelete(event, card.key)} title="delete this Timeline"  role="button" tabindex="0">
					<svg viewBox="0 0 20 20">
						<use x="0" y="0" href="#b_delete"/>
					</svg>
				</div>
			</div>
		</div>
	{/each}
	<div class='emptyCard' on:click={gotoNew} on:keydown={gotoNew} role="button" tabindex="0"><div class='addMore'>➕</div></div>
</div>
{/key}
<PopUpConfirmation bind:this={popUpComponent}/>
<Toast bind:this={toastComponent}/>

<style>
	#search{
		width: 50vw;
		background-color: beige;
		border-radius: 10px;
		border:1px dotted;
		margin:5vw auto 0 auto;
		font-size: 2rem;
		font-family: 'Trebuchet MS', Helvetica, sans-serif;
		text-align:center;
	}
	#label{
		padding: 2vw;
	}
	#create{
		padding: 2vw;
	}
	button{
		transform: rotate(-10deg);
		cursor: pointer;
		border: none;
		background-color: transparent;
		color:green;
		font-size: 2rem;
		font-family: 'Trebuchet MS', Helvetica, sans-serif;
	}
	button:hover{
		transform: rotate(-9deg);
	}
	#current{
		width: 40vw;
		margin: 2vw auto 0 auto;
	}
	.card, .emptyCard{
		position: relative;
		margin-bottom: 20px;
	}
	.card:hover, .emptyCard:hover{
		background-color: rgb(215, 233, 206);	
		cursor: pointer;
		transform: scale(1.05);
	}
	.thumbnail{
		border:1px solid #888;
		border-radius: 5px;
		padding: 5px;
		display: inline-block;
	}
	.title{
		font-size: 2em;
		position: absolute;
		top:0;
		left:275px;
	}
	.lastUpdate{
		font-size: 1rem;
		position: absolute;
		top:50px;
		left:275px;
	}
	
	.information{
		position: absolute;
		bottom:0px;
		left:225px;
	}
	.action{
		position: absolute;
		bottom: 0vw;
		font-size: 1rem;
		padding: 0.51vw;
		right: 0;
	}
	.addMore{
		font-size: 6em;
		position: absolute;
		top: 7px;
		left: 48%;
	}
	:global(div.live_cmd){
        width:20px;
        height: 20px;
        display:inline-block;
        margin:1px;
    }
    :global(div.live_cmd:hover){
        fill:rgb(33, 56, 33);
        background-color: rgb(188, 224, 154);
        border-radius: 45px;
        border: 1px solid rgb(188, 224, 154);
        margin:0;
    }
    :global(div.live_cmd_red:hover){
        fill:rgb(56, 33, 33);
        background-color: rgb(221, 175, 175);
        border: 1px solid rgb(221, 175, 175);
    }
</style>