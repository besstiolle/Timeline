import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	NotFoundOnlineException,
	NotFoundException,
	JsonParserException,
	DuplicateEntityException
} from '$lib/timelineException.class'; 

describe('Custom Exceptions', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	it('should instantiate NotFoundOnlineException with formatted message', () => {
		const exc = new NotFoundOnlineException();

		expect(exc).toBeInstanceOf(Error);
		expect(exc.message).toContain("doesn't exist on remote endpoint");
	});

	it('should instantiate NotFoundException and interpolate entity arguments', () => {
		const exc = new NotFoundException('Task', 42);

		expect(exc.args).toEqual(['Task', 42]);
		expect(exc.message).toContain('The entity Task with the id 42');
	});

	it('should instantiate JsonParserException and interpolate key/value pair', () => {
		const exc = new JsonParserException('badKey', 'badValue', 'myFunc');

		expect(exc.message).toContain('badKey');
		expect(exc.message).toContain('badValue');
	});

	it('should instantiate DuplicateEntityException and format duplicate message', () => {
		const exc = new DuplicateEntityException('Milestone', 10);

		expect(exc.message).toContain('Milestone');
		expect(exc.message).toContain('10');
	});
});