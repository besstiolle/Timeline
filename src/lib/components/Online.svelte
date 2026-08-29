<script lang="ts">
	import { page } from '$app/state';

	import { Helpers } from '$lib/helpers';
	import { remove, create } from '$lib/timelineRepository';
	import ShadowBox from '$lib/components/ShadowBox.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { Rights } from '$lib/rights.class';
	import { FactoryCards } from '$lib/factoryCards';
	import type { ResponseWithMeta } from '$lib/types';
	import { m } from '../../paraglide/messages';
	import { commitState } from '../state/commitState.svelte';
	import { shadowBoxComponentState } from '$lib/state/shadowBoxComponentState.svelte';
	import { toastComponentState } from '$lib/state/toastComponent.svelte';
	import { appState } from '$lib/state/appState.svelte';
	import { volatileAppState } from '$lib/state/volatileAppState.svelte';

	export function commit() {
		if (
			volatileAppState.lastUpdatedLocally !== null &&
			volatileAppState.lastCommitedRemotely !== null &&
			volatileAppState.lastUpdatedLocally - volatileAppState.lastCommitedRemotely > 5000
		) {
			commitState.inProgress = true;
			console.debug('gap > 5000 ms : %o', volatileAppState.lastUpdatedLocally - volatileAppState.lastCommitedRemotely);
			create(appState.currentTimeline)
				.then((responseWithMeta: ResponseWithMeta) => {
					volatileAppState.lastCommitedRemotely = responseWithMeta.meta.ts;
					toastComponentState.show(m.online_toast_saved_success());
					
				})
				.catch((err) => {
					console.error('Error where calling create() in Online.commit() : %o', err);
					toastComponentState.show(m.online_toast_remote_offline(), false, 0);
				})
				.finally(() => {
					commitState.inProgress = false;
				});
		} else {
			console.debug('gap < 5000 ms : %o', volatileAppState.lastUpdatedLocally - volatileAppState.lastCommitedRemotely);
		}
	}

	const base_url = page.url.protocol + '//' + page.url.host;

	function doOffline() {
		let ownerKey = appState.currentTimeline.ownerKey;
		if (ownerKey == null) {
			ownerKey = '';
		}
		let seachParams = new URLSearchParams([
			['key', appState.currentTimeline.key],
			['ownerKey', ownerKey]
		]);
		remove(seachParams)
			.then(() => {
				appState.currentTimeline.isOnline = false;
				appState.currentTimeline.ownerKey = null;
				appState.currentTimeline.writeKey = null;
				appState.currentTimeline.readKey = null;
				volatileAppState.lastCommitedRemotely = -1;

				//Rewrite URL
				window.location.href = base_url + '/g/' + appState.currentTimeline.key;
			})
			.catch((err) => {
				console.error('Error where calling remove() in Online.doOffline() : %o', err);
				toastComponentState.show(m.online_toast_remote_offline(), false, 0);
			})
			.finally(() => {});

		//update cards with the online/offline information
		//TODO : vérifier pertinence de cet update vs update réalisé dans l'obs du store
		appState.cards = FactoryCards.updateCardsWithTimeline(appState.cards, appState.currentTimeline);
	}
	function doOnline() {
			appState.currentTimeline.isOnline = true;
			appState.currentTimeline.ownerKey = Helpers.randomeString(64);
			appState.currentTimeline.writeKey = Helpers.randomeString(64);
			appState.currentTimeline.readKey = Helpers.randomeString(64);

		create(appState.currentTimeline)
			.then((responseWithMeta: ResponseWithMeta) => {
				volatileAppState.lastCommitedRemotely = responseWithMeta.meta.ts;
				toastComponentState.show(m.online_toast_saved_success());
				//Refresh internal Rights value
				appState.rights = new Rights(appState.currentTimeline.ownerKey);
			})
			.catch((err) => {
				console.error('Error where calling create() in Online.doOnline() : %o', err);
				toastComponentState.show(m.online_toast_remote_offline(), false, 0);
					appState.currentTimeline.isOnline = false;
					appState.currentTimeline.ownerKey = null;
					appState.currentTimeline.writeKey = null;
					appState.currentTimeline.readKey = null;
			})
			.finally(() => {});

		//update cards with the online/offline information
		//TODO : vérifier pertinence de cet update vs update réalisé dans l'obs du store
		appState.cards = FactoryCards.updateCardsWithTimeline(appState.cards, appState.currentTimeline);
	}

	function select(event: MouseEvent) {
		//const input = document.getElementById("text-box");
		//input.focus();
		//input.select();
		const input = event.target as HTMLInputElement;
		input.focus();
		input.select();
	}
</script>

{#if shadowBoxComponentState.openShadowBoxForOnline}
<ShadowBox id="onlinePopup">
	{#if appState.currentTimeline.isOnline}
		<div class="warn">
			{m.online_warn_before_offline_0()} "<span class="font-bold"
				>{m.online_warn_before_offline_1()}</span
			>" {m.online_warn_before_offline_2()}
		</div>

		<!--Action-->
		<button
			class="mx-auto mt-10 flex gap-2 rounded-full shadow-xl/15 p-3 cursor-pointer
                bg-linear-to-r/srgb from-cyan-600 to-emerald-500 hover:bg-linear-to-r/hsl hover:to-cyan-600 hover:from-emerald-500"
			onclick={doOffline}
		>
			<svg viewBox="0 0 600 600" class="size-6 fill-gray-800 dark:fill-blue-50">
				<use x="5" y="75" href="#ico_cloud" />
			</svg>
			{m.online_action_offline()}
		</button>

		<div class="text-left mx-30 mt-5">
			<label class="block" for="readOnly">{m.online_readonly()} : </label>
			<input
				class="block w-full"
				id="readOnly"
				readonly
				type="text"
				onclick={select}
				value={base_url +
					'/g/' +
					appState.currentTimeline.key +
					'?r=' +
					appState.currentTimeline.readKey}
			/>
		</div>
		<div class="text-left mx-30 mt-5">
			<label class="block" for="writer">{m.online_writer()} : </label>
			<input
				class="block w-full"
				id="writer"
				readonly
				type="text"
				onclick={select}
				value={base_url +
					'/g/' +
					appState.currentTimeline.key +
					'?w=' +
					appState.currentTimeline.writeKey}
			/>
		</div>
		<div class="text-left mx-30 mt-5">
			<label class="block" for="owner">{m.online_owner()} : </label>
			<input
				class="block w-full"
				id="owner"
				readonly
				type="text"
				onclick={select}
				value={base_url +
					'/g/' +
					appState.currentTimeline.key +
					'?o=' +
					appState.currentTimeline.ownerKey}
			/>
		</div>
	{:else}
		<div class="warn">
			{m.online_warn_before_online_0()} "<span class="font-bold"
				>{m.online_warn_before_online_1()}</span
			>" {m.online_warn_before_online_2()}
		</div>

		<!--Action-->
		<button
			class="mx-auto mt-10 flex gap-2 rounded-full shadow-xl/15 p-3 cursor-pointer
                bg-linear-to-r/srgb from-cyan-600 to-emerald-500 hover:bg-linear-to-r/hsl hover:to-cyan-600 hover:from-emerald-500"
			onclick={doOnline}
		>
			<svg viewBox="0 0 600 600" class="size-6 fill-gray-800 dark:fill-blue-50">
				<use x="5" y="75" href="#ico_cloud" />
			</svg>
			{m.online_action_online()}
		</button>
	{/if}
</ShadowBox>{/if}
<Toast />

<style>
</style>
