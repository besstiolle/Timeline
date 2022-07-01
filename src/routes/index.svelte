
<script lang="ts">
import { FactoryPicto } from "$lib/factoryPicto";

import { Helpers } from "$lib/helpers";
import { store } from "$lib/stores";

import type { Struct } from "$lib/struct.class";


function toStringDate(date: Date): string {
	const DATE_SEPARATOR = "/"
	const HOUR_SEPARATOR = "h"
	const SPACE_SEPARATOR = " "
	return date.getDate()
		+ DATE_SEPARATOR + (date.getMonth() + 1).toString().padStart(2, '0') 
		+ SPACE_SEPARATOR + date.getHours()
		+ HOUR_SEPARATOR + date.getMinutes()
}

function goto(event, id = null){
	if(id == null){
		id = Helpers.randomeString(64)
	}
	window.location.href = '/g/'+id
}

function getCards(): Array<Struct.Card>{
	return $store.cards
}

/**
 * Retrive the picto from localStorage with the timeline's key 
 * @param key
 */
function getThumbnail(key:string):string{
	let thumbnail = FactoryPicto.getPicto(key)	
	if(thumbnail == null){
		thumbnail = '/static/notFound.webp'
	}
	return thumbnail
}

let cards = getCards()



//TODO : add miniature ?
//TODO : add functions to duplicate/delete with confirmations
//TODO : improve goto with owr keys
//TODO : show "online/offline" status
</script>

<svelte:head>
	<title>Timeline Charts</title>
</svelte:head>

<div id="search">
	<div id='label'>Would you like to come back to your creations ?</div>
	<div id='create'>Or <button on:click={goto}>create</button> a new one !</div>
</div>

<div id='current'>
	{#each cards as card}
		<div class='card' on:click={() => goto(null, card.key)}>
			<img src={getThumbnail(card.key)} id='foo' alt='miniature ' height="150px" width="250px"/>
			<div class='title'>{card.title}</div>
			<div class='lastUpdate'>Updated : {toStringDate(card.lastUpdated)}</div>
		</div>
	{/each}
	<div class='emptyCard' on:click={goto}><div class='addMore'>+</div></div>
</div>

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
		height:10vw;
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
		bottom: 0;
		font-size: 1rem;
		padding: 0.51vw;
		right: 0;
	}
	.emptyCard{
	}
	.addMore{
		font-size: 10em;
		position: absolute;
		top: 5px;
		left: 44px;
	}
</style>