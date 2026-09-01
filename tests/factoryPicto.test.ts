import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FactoryPicto } from '$lib/factoryPicto'; 
import { CustomLocalStorage } from '$lib/customLocalStorage';
import { LOCAL_STORAGE } from '$lib/constantes';
import { Timeline } from '$lib/struct.class.svelte';

vi.mock('$lib/customLocalStorage', () => ({
	CustomLocalStorage: {
		save: vi.fn(),
		getPicto: vi.fn()
	}
}));

describe('FactoryPicto', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('should delegate createPicto to CustomLocalStorage.save using prefixed key', () => {
		const timeline = new Timeline('timeline-123', 'Title');
		const base64Data = 'data:image/png;base64,iVBORw0KGgo...';

		FactoryPicto.createPicto(timeline, base64Data);

		expect(CustomLocalStorage.save).toHaveBeenCalledWith(
			LOCAL_STORAGE.KEY_PICTO + 'timeline-123',
			base64Data
		);
	});

	it('should delegate getPicto to CustomLocalStorage.getPicto', () => {
		vi.mocked(CustomLocalStorage.getPicto).mockReturnValue('data:image/png;base64,mock');

		const result = FactoryPicto.getPicto('timeline-123');

		expect(CustomLocalStorage.getPicto).toHaveBeenCalledWith('timeline-123');
		expect(result).toBe('data:image/png;base64,mock');
	});
});