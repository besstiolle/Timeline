const BLANK = 'about:blank';

/**
 *  An abstract class to answer RFC 9457
 *  https://www.rfc-editor.org/rfc/rfc9457
 */
export abstract class ProblemJsonResponse extends Response {
	public _type: string;
	public _title: string;
	public _status: number;
	public _detail?: string;
	public _instance?: string;

	/**
	 *
	 * @param type URI identifier for the problem
	 * @param title Short description
	 * @param status HTTP code
	 * @param detail More information
	 * @param instance the url of the Request
	 */
	constructor(type: string, title: string, status: number, detail?: string, instance?: string) {
		console.error(
			`A ProblemJsonResponse was emited on '${instance}' with type '${type}' and detail : '${detail}'`
		);
		const body = {
			type: type,
			title: title,
			status: status,
			detail: import.meta.env.DEV ? detail : '',
			instance: instance
		};
		const bodyText = JSON.stringify(body);
		const headers = new Headers();
		const encoder = new TextEncoder();
		headers.set('content-length', encoder.encode(bodyText).byteLength.toString());
		headers.set('content-type', 'application/problem+json');
		super(bodyText, {
			status: status,
			headers: headers
		});
		this._type = type;
		this._title = title;
		this._status = status;
		this._detail = detail;
		this._instance = instance;
	}
}

export class TIMELINE_NOT_FOUND_ProblemJsonResponse extends ProblemJsonResponse {
	/**
	 * @param instance the url of the Request
	 * @param key The resource Identifier
	 */
	constructor(instance: string, key: string) {
		super(
			BLANK,
			'Resource Not Found',
			404,
			`Timeline item with id ${key} does not exist.`,
			instance
		);
	}
}

export class REGEX_FAILED_ProblemJsonResponse extends ProblemJsonResponse {
	/**
	 * @param instance the url of the Request
	 * @param field The name of the field checked
	 * @param value The value checked
	 * @param regex The Regex used to check
	 */
	constructor(instance: string, field: string, value: string, regex: string) {
		super(
			'#422Regex',
			'a Regex check failed',
			422,
			`The field ${field} with value ${value} didn't respect the regex ${regex}.`,
			instance
		);
	}
}

export class EMPTY_KEYS_ProblemJsonResponse extends ProblemJsonResponse {
	/**
	 * @param instance the url of the Request
	 */
	constructor(instance: string) {
		super(
			'#401EmptyKeys',
			'No Keys was provided',
			401,
			`The keys ownerKey, writeKey & readKey are all empty. You must provide at least one of them.`,
			instance
		);
	}
}

export class INVALID_PAYLOAD_ProblemJsonResponse extends ProblemJsonResponse {
	/**
	 * @param instance the url of the Request
	 */
	constructor(instance: string) {
		super(
			'#400InvalidPayload',
			'Invalid Request Payload',
			400,
			`Json malformated or valid but with the wrong type of Object`,
			instance
		);
	}
}
export class CREDENTIALS_NOT_EQUALS_ProblemJsonResponse extends ProblemJsonResponse {
	/**
	 * @param instance the url of the Request
	 * @param field the name of the field tested in the payload
	 * @param value the value of the field tested in the payload
	 */
	constructor(instance: string, field: string, value: string) {
		super(
			'#401InvalidCredentials',
			'Invalid credentials during commit',
			401,
			`Your payload identifiers (${field}:${value}) differ from those stored in the database`,
			instance
		);
	}
}

export class EMPTY_OWNERKEY_ProblemJsonResponse extends ProblemJsonResponse {
	/**
	 * @param instance the url of the Request
	 */
	constructor(instance: string) {
		super(
			'#401EmptyOwnerKey',
			'OwnerKey is missing',
			401,
			`Your payload ownerKey is mandatory during creation`,
			instance
		);
	}
}

export class METHOD_NOT_ALLOWED_ProblemJsonResponse extends ProblemJsonResponse {
	/**
	 * @param instance the url of the Request
	 * @param method the http method
	 */
	constructor(instance: string, method: string) {
		super(
			BLANK,
			'Method is not allowed on this entrypoint',
			405,
			`The Method ${method} is not allowed on entrypoint ${instance}`,
			instance
		);
	}
}
