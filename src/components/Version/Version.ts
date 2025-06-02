import { get } from '$lib/aboutRepository';
import type { GitVersions, Version } from '$lib/struct.class';
import type { ResponseWithMeta } from '../../routes/api/timeline/types';

const REGEX_SEMVER = new RegExp('^[vV]?([0-9])+.([0-9])+.([0-9])+$', '');

export async function getDistantVersion(): Promise<GitVersions> {
	const url = 'https://raw.githubusercontent.com/besstiolle/Timeline/refs/heads/main/version.json';
	const response = await fetch(url);
	if (!response.ok) throw new Error(`HTTP error ${response.status}`);

	const data = await response.json();
	return data;
}

export function getCurrentVersion(): Promise<ResponseWithMeta> {
	return get();
}

export function toString(version: Version) {
	return version.x + '.' + version.y + '.' + version.z;
}

export function versionCompare(v1: Version, v2: Version) {
	if (v1.x > v2.x) {
		return 1;
	} else if (v1.x < v2.x) {
		return -1;
	} else {
		if (v1.y > v2.y) {
			return 1;
		} else if (v1.y < v2.y) {
			return -1;
		} else {
			if (v1.z > v2.z) {
				return 1;
			} else if (v1.z < v2.z) {
				return -1;
			} else {
				return 0;
			}
		}
	}
}

export function toVersion(versionParam: string): Version {
	const defaultVersion = '0.0.0';

	let found = versionParam.match(REGEX_SEMVER);

	if (!found) {
		found = defaultVersion.match(REGEX_SEMVER) as RegExpMatchArray;
		console.warn("versionParam wasn't in the expected format : ", versionParam);
	}

	return {
		x: Number(found[1]),
		y: Number(found[2]),
		z: Number(found[3])
	};
}
