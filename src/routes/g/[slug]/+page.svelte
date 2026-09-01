<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';

	import { NotFoundOnlineException } from '$lib/timelineException.class';
	import { m } from '../../../paraglide/messages';
	import { Timeline } from '$lib/struct.class.svelte';
	import { goto } from '$app/navigation';
	import { toastComponentState } from '$lib/state/toastComponent.svelte';
	import { appState } from '$lib/state/appState.svelte';
	import { volatileAppState } from '$lib/state/volatileAppState.svelte';
	import { FactoryCards } from '$lib/factoryCards';
	import { CustomLocalStorage } from '$lib/customLocalStorage';
	import { Rights } from '$lib/rights.class';
	import { JsonParser } from '$lib/jsonParser';
	import { FactoryTimeline } from '$lib/factoryTimeline';
	import { get } from '$lib/timelineRepository';
	import type { ResponseWithMeta } from '$lib/types';

	import Draw from '$lib/components/Draw.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { resolve } from '$app/paths';

	appState.rights = new Rights(page.url.searchParams);

	const slug = page.params.slug as string;

	if (!slug.match('^[a-zA-Z0-9]{64}$')) {
		$effect(() => {
			const timer = setTimeout(() => {
				goto(resolve('/'));
			}, 1000);

			// Clearing if user go somechere else before timing
			return () => clearTimeout(timer);
		});

		console.error(m.slug_toast_image_misconfigurated(), slug);
		if (browser) {
			toastComponentState.show(m.slug_toast_image_misconfigurated(), false, 0);
		}
	}

	let currentTimeline: Timeline = CustomLocalStorage.getTimeline(slug);


	//If the local copie of Timeline has bigger rights than current url query parameter
	//  We refresh the window.location with the higher rights
	let queryString = null;
	if (!appState.rights.hasOwner() && currentTimeline?.ownerKey) {
		queryString = '?o=' + currentTimeline.ownerKey;
	} else if (!appState.rights.hasWriter() && currentTimeline?.writeKey) {
		queryString = '?w=' + currentTimeline.writeKey;
	} else if (!appState.rights.hasReader() && currentTimeline?.readKey) {
		queryString = '?r=' + currentTimeline.readKey;
	}
	if (queryString) {
		window.location.href =
			page.url.protocol + '//' + page.url.host + '/g/' + currentTimeline.key + queryString;
	}

	//If loading a local file
	if (appState.rights.isNone()) {
		if (!currentTimeline && browser) {
			currentTimeline = new Timeline(slug, m.slug_default_timeline_title());
			currentTimeline = FactoryTimeline.initiate(currentTimeline);
		} 
		appState.currentTimeline = currentTimeline;
		if(currentTimeline && browser){
			appState.rights = new Rights(slug)
		}
	//Si loading distant data from a local file
	} else if (browser) {
		let keyUrl = appState.rights.getTimelineField();
		if (keyUrl == null) {
			keyUrl = '';
		}
		let valueUrl = appState.rights.getSlugParamKeyValue();
		if (valueUrl == null) {
			valueUrl = '';
		}
		let seachParams = new URLSearchParams([
			['key', slug],
			[keyUrl, valueUrl]
		]);
		get(seachParams)
			.then((responseWithMeta: ResponseWithMeta) => {
				currentTimeline = JSON.parse(
					JSON.stringify(responseWithMeta.data),
					JsonParser.timelineReviver
				);

				appState.currentTimeline = currentTimeline;
				//Update date of lastUpdated in the clone
				volatileAppState.lastUpdatedLocally = 0;
				volatileAppState.lastCommitedRemotely = responseWithMeta.meta.ts;
				// Tricks : Set to true if we don't want to refresh lastUpdatedLocally property
				volatileAppState._cancelRefreshLastUpdatedLocally = true;
			})
			.catch((err) => {
				console.error('Error where calling get() in [slug].svelte : %o', err);

				if (err instanceof NotFoundOnlineException) {
					toastComponentState.show(m.slug_toast_distant_timeline_non_existent(), false, 10);
					//Refresh page after 10s
					setTimeout(function () {
						window.location.href = page.url.protocol + '//' + page.url.host + '/g/' + slug;
					}, 5000);
				} else {
					toastComponentState.show(m.slug_toast_remote_offline(), false, 0);
				}
				appState.currentTimeline = currentTimeline;
			})
			.finally(() => {});
	}

	//(re)Create Cards
	if(appState.currentTimeline && appState.currentTimeline.isInitiate){
		//console.info("refresh cards with", appState.currentTimeline.title)
		appState.cards = FactoryCards.updateCardsWithTimeline(appState.cards, appState.currentTimeline);
	}
		
</script>

<svelte:head>
	<title
		>[T-C] {appState.currentTimeline ? appState.currentTimeline.title : m.slug_default_title()}</title
	>
</svelte:head>

{#if appState.currentTimeline?.isInitiate}
	<Draw />
{/if}

<Toast />
