<script lang="ts">
	import { LOCAL_STORAGE } from '$lib/constantes';
	import { CustomLocalStorage } from '$lib/customLocalStorage';
	import { FactoryCards } from '$lib/factoryCards';
	import { FactoryPicto } from '$lib/factoryPicto';
	import { Helpers } from '$lib/helpers';
	import { store } from '$lib/stores';
	import PopUpConfirmation from '$lib/components/PopUpConfirmation.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { Card, Timeline } from '$lib/struct.class';
	import { m } from '../../../paraglide/messages';

	let popUpComponent: PopUpConfirmation;
	let toastComponent: Toast;

	function show(event: MouseEvent | KeyboardEvent, index: number) {
		event.stopPropagation();
		const menu = document.getElementById(`menu-${index}`) as HTMLElement;
		menu.classList.remove('hidden');
	}
	function hide(event: MouseEvent) {
		event.stopPropagation();
		const menus = document.getElementsByClassName(`menus`) as HTMLCollectionOf<HTMLElement>;
		Array.from(menus).forEach((menu) => {
			menu.classList.add('hidden');
		});
	}

	function goto(event: Event | null, key: string) {
		window.location.href = '/g/' + key;
	}

	/**
	 * Called to duplicate a existing chart
	 * @param event
	 * @param key the key of the chart user want to duplicate.
	 */
	function duplicate(event: Event, key: string): void {
		event.stopPropagation();
		let clone: Timeline = structuredClone(CustomLocalStorage.getTimeline(key));
		clone.ownerKey = null;
		clone.writeKey = null;
		clone.readKey = null;
		clone.isOnline = false;
		clone.title = generateTitle(clone['title']);
		clone.key = Helpers.randomeString(64);

		let newCard = new Card(clone['key'], clone['title']);
		$store.cards = [...$store.cards, newCard];
		CustomLocalStorage.save(clone['key'], clone);
	}

	/**
	 * Generate a new title with unique extension like [0-9]
	 * @param title the original title
	 */
	function generateTitle(title: string): string {
		let index = 1;
		while (true) {
			if (FactoryCards.getFirstIndexByTitle($store.cards, title + ' [' + index + ']') !== null) {
				index++;
			} else {
				break;
			}
		}
		return title + ' [' + index + ']';
	}

	/**
	 * Show popup to ask user if he really want to delete a chart
	 * @param event
	 * @param key
	 */
	function askDelete(event: Event, key: string): void {
		event.stopPropagation();
		let timelineToDelete: Timeline = CustomLocalStorage.getTimeline(key);
		if (timelineToDelete && timelineToDelete.isOnline) {
			console.warn(
				m.landing_toast_remote_timeline_cant_be_deleted({ title: timelineToDelete.title })
			);
			toastComponent.show(
				m.landing_toast_remote_timeline_cant_be_deleted({ title: timelineToDelete.title }),
				false,
				5
			);
			return;
		}
		popUpComponent.show(
			m.landing_popup_confirmation_before_deletion_text(),
			doDelete,
			m.landing_popup_confirmation_before_deletion_continue(),
			[key],
			doNotDelete,
			m.landing_popup_confirmation_before_deletion_cancel(),
			[]
		);
	}

	/**
	 * Callback called if the user cancel the delete action
	 *  Nothing will happen
	 * @param args
	 */
	function doNotDelete(args: string[]): void {
		//Nothing more to do
		console.debug('args : ', args);
	}

	/**
	 * Callback called if the user confirme the delete action
	 *  The chart will be deleted
	 *  The cards will be refresh without the cart deleted
	 *  The picto will be deleted
	 * @param args
	 */
	function doDelete(args: string[]): void {
		let key = args[0];

		let timelineToDelete: Timeline = CustomLocalStorage.getTimeline(key);
		if (timelineToDelete && timelineToDelete.isOnline) {
			console.warn(`this chart "${timelineToDelete.title}" is online and can't be deleted`);
			toastComponent.show(
				`this chart "${timelineToDelete.title}" is online and can't be deleted`,
				false,
				5
			);
			return;
		}
		CustomLocalStorage.remove(key);
		let index = FactoryCards.getIndexByKey($store.cards, key);
		if (index !== null) {
			$store.cards = $store.cards.toSpliced(index, 1);
		}

		CustomLocalStorage.remove(LOCAL_STORAGE.KEY_PICTO + key);
	}

	/**
	 * Retrive the picto from localStorage with the timeline's key
	 * @param key
	 */
	function getThumbnail(key: string): string {
		let thumbnail = FactoryPicto.getPicto(key);
		if (thumbnail == null) {
			thumbnail = '/notFound.webp';
		}
		return thumbnail;
	}

	function toStringDate(date: Date): string {
		const DATE_SEPARATOR = '/';
		const HOUR_SEPARATOR = ':';
		const SPACE_SEPARATOR = ' ';
		return (
			date.getDate().toString().padStart(2, '0') +
			DATE_SEPARATOR +
			(date.getMonth() + 1).toString().padStart(2, '0') +
			DATE_SEPARATOR +
			date.getFullYear().toString().padStart(2, '0') +
			SPACE_SEPARATOR +
			date.getHours().toString().padStart(2, '0') +
			HOUR_SEPARATOR +
			date.getMinutes().toString().padStart(2, '0')
		);
	}
</script>

<div class="w-6xl m-auto mt-10 flex flex-wrap">
	{#each $store.cards as card, index (card.key)}
		<!-- One card-->
		<div class="basis-1/3">
			<div
				class="max-w-95/100 m-auto mt-5 flex shadow-xl/30 bg-blue-100 dark:bg-slate-800 cursor-pointer"
				onclick={() => goto(null, card.key)}
				onkeydown={() => goto(null, card.key)}
				role="button"
				tabindex="0"
			>
				<div class="flex-1/3 p-2">
					<div
						class="h-20 bg-no-repeat bg-center"
						style="background-image: url('{getThumbnail(card.key)}');"
					></div>
				</div>

				<div class="flex-2/3 p-2">
					<div class="relative">
						<!-- Contextual menu-->
						<div
							id="menu-toggle-{index}"
							class="float-right relative"
							onkeydown={(event) => {
								show(event, index);
							}}
							onclick={(event) => {
								show(event, index);
							}}
							onmouseleave={hide}
							role="button"
							tabindex="0"
						>
							<svg viewBox="0 0 32 32" class="size-6 fill-gray-800 dark:fill-blue-50"
								><use x="0" y="0" href="#ico_menu" /></svg
							>

							<div
								id="menu-{index}"
								class="menus hidden absolute -top-5 w-50 z-10 bg-blue-100 dark:bg-slate-800 shadow-xl/30"
							>
								<!-- Button Dupplicate -->
								<div
									class="p-2
										hover:text-shadow-lg hover:text-shadow-white
										dark:hover:text-shadow-lg dark:hover:text-shadow-slate-700
										"
									onclick={(event) => duplicate(event, card.key)}
									onkeydown={(event) => duplicate(event, card.key)}
									role="button"
									tabindex="0"
								>
									<svg viewBox="0 0 32 32" class="float-left size-6 fill-gray-800 dark:fill-blue-50"
										><use x="5" y="8" href="#b_duplicate" /></svg
									>
									{m.landing_action_duplicate()}
								</div>

								<!-- Button delete-->
								<div
									class:hidden={card.isOnline}
									class="p-2
										border-t-1 border-blue-300 dark:border-slate-900
										hover:text-shadow-lg hover:text-shadow-white
										dark:hover:text-shadow-lg dark:hover:text-shadow-slate-700
										"
									onclick={(event) => askDelete(event, card.key)}
									onkeydown={(event) => askDelete(event, card.key)}
									role="button"
									tabindex="0"
								>
									<svg viewBox="0 0 40 40" class="float-left size-6 fill-gray-800 dark:fill-blue-50"
										><use x="5" y="8" href="#ico_delete" /></svg
									>
									{m.landing_action_delete()}
								</div>

								<!-- Button delete-->
								<div
									class:hidden={!card.isOnline}
									class="p-2
										border-t-1 border-blue-300 dark:border-slate-900
										"
								>
									<svg
										viewBox="0 0 600 600"
										class="float-left size-6 fill-gray-800 dark:fill-blue-50"
										><use x="5" y="75" href="#ico_cloud" /></svg
									>
									{m.landing_action_cloud()}
								</div>
							</div>
						</div>
						<!-- /END Contextual menu-->

						<h3>{card.title}</h3>
					</div>
					<p class="text-xs">
						{m.landing_updated_text()} : {#if card.lastUpdated}{toStringDate(card.lastUpdated)}{/if}
					</p>
					<div class=""></div>
				</div>
			</div>
		</div>
	{/each}
</div>

<PopUpConfirmation bind:this={popUpComponent} />
<Toast bind:this={toastComponent} />
