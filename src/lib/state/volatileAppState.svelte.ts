/**
 * A state class with information wich won't be persisted.
 */
export class VolatileAppState {
    lastUpdatedLocally = $state<number>(0);
    lastCommitedRemotely = $state<number>(0);
    _cancelRefreshLastUpdatedLocally = $state<boolean>(false);
    timelineStart = $state<Date>(new Date());
    timelineEnd = $state<Date>(new Date());
    timelineDifferencial = $state<string>('');
    viewbox = $state<string>('0 0 0 0')

}

// Instance réactive unique exportée pour toute l'application
export const volatileAppState = new VolatileAppState();