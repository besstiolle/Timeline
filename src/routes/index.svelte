
<script lang="ts">
import { LOCAL_STORAGE } from "$lib/constantes";

import { CustomLocalStorage } from "$lib/customLocalStorage";

import { FactoryTimeline } from "$lib/factoryTimeline";

import { FactoryPicto } from "$lib/factoryPicto";

import { Helpers } from "$lib/helpers";
import { store } from "$lib/stores";
import { Struct } from "$lib/struct.class";

let showAskPopup:boolean = false

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

function goto(event, key:string){
	window.location.href = '/g/' + key
}

function duplicate(event, key:string):void {
	event.stopPropagation();
	let clone:object = {...CustomLocalStorage.getTimeline(key)}
	clone['ownerKey']=null
	clone['writeKey']=null
	clone['readKey']=null
	clone['isOnline']=false
	clone['title']+= "[1]"
	clone['key'] = Helpers.randomeString(64)

	let cards = CustomLocalStorage.getCards()
	let newCard = new Struct.Card(clone['key'], clone['title'])
	console.info('newCard : %o', newCard)
	cards.push(newCard)
	CustomLocalStorage.save(clone['key'], clone)
	CustomLocalStorage.save(LOCAL_STORAGE.KEY_CARDS, cards)
	$store.cards = CustomLocalStorage.getCards()
}

function askDelete(event, key:string):void{
	event.stopPropagation();
	let timelineToDelete: Struct.Timeline = CustomLocalStorage.getTimeline(key)
	if(timelineToDelete.isOnline){
		return
	}
	showAskPopup=true
	
}
function doNotDelete(){
	showAskPopup=false
}
function doDelete(event, key:string):void{
	event.stopPropagation();
	showAskPopup=false
	let timelineToDelete: Struct.Timeline = CustomLocalStorage.getTimeline(key)
	if(timelineToDelete.isOnline){
		return
	}
	CustomLocalStorage.remove(key)
	let cards = CustomLocalStorage.getCards()
	for(let i=0; i < cards.length; i++){
		if (cards[i].key === key){
			cards.splice(i,1)
			break
		}
	}
	CustomLocalStorage.save(LOCAL_STORAGE.KEY_CARDS, cards)

	$store.cards = cards
}

//TODO : simplify theses 4 lines below
function getCards(): Array<Struct.Card>{
	return $store.cards
}

let cards = getCards()



//TODO : add miniature ?
//TODO : add functions to duplicate/delete with confirmations
//TODO : show "online/offline" status
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
{#key $store}
<div id='current'>
	{#each cards as card}
		<div class='card' on:click={() => goto(null, card.key)}>
			<img src={getThumbnail(card.key)} id='foo' alt='miniature ' height="150px" width="250px"/>
			<div class='title'>{card.title}</div>
			<div class='lastUpdate'>Updated : {toStringDate(card.lastUpdated)}</div>
			<div class:hidden={false} class='information' title="This Timeline is saved remotely and can't be deleted">
				<i class="online"></i>
			</div>
			<div class='action'>
				<div name="T{card.key}"  class="live_cmd" on:click={(event) => duplicate(event, card.key)} title="duplicate this Timeline">
					<svg viewBox="0 0 20 20">
						<use x="0" y="0" href="#b_duplicate"/>
					</svg>
				</div>
				<div class:hidden={false} name="T{card.key}"  class="live_cmd live_cmd_red" on:click={(event) => doDelete(event, card.key)} title="delete this Timeline">
					<svg viewBox="0 0 20 20">
						<use x="0" y="0" href="#b_delete"/>
					</svg>
				</div>
			</div>
		</div>
	{/each}
	<div class='emptyCard' on:click={gotoNew}><div class='addMore'>➕</div></div>
</div>
{/key}

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
		width: 56vw;
		margin: 2vw auto 0 auto;
	}
	.card, .emptyCard{
		width:10vw;
		background-color: rgb(238, 238, 238);
		height:12vw;
		display: inline-block;
		text-align: center;
		position: relative;
		margin: 0.5vw;
	}
	.card:hover, .emptyCard:hover{
		background-color: rgb(215, 233, 206);	
		cursor: pointer;
		transform: scale(1.05);
	}

	.title{
		font-size: 2em;
		position: absolute;
		max-width: 100%;
		overflow: hidden;
		max-height: 75%;
	}
	.lastUpdate{
		position: absolute;
		bottom: 2vw;
		font-size: 1rem;
		padding: 0.51vw;
		right: 0;
	}
	
	.information{
		position: absolute;
		bottom: 0vw;
		font-size: 1rem;
		padding: 0.51vw;
		left: 0;
		cursor: default;
	}
	.action{
		position: absolute;
		bottom: 0vw;
		font-size: 1rem;
		padding: 0.51vw;
		right: 0;
	}
	.emptyCard{
	}
	.addMore{
		font-size: 6em;
		position: absolute;
		top: 7px;
		left: 9px;
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
        border: 1px solid rgb(221, 175, 175);;
    }
</style>