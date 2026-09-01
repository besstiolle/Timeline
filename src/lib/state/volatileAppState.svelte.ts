/**
 * A state class with information wich won't be persisted.
 */
export class VolatileAppState {
    lastUpdatedLocally = $state<number>(0);
    lastCommitedRemotely = $state<number>(0);
}

// Instance réactive unique exportée pour toute l'application
export const volatileAppState = new VolatileAppState();