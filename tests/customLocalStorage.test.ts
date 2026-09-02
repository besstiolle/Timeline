import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomLocalStorage } from '$lib/customLocalStorage';
import { LOCAL_STORAGE } from '$lib/constantes';
import { JsonParser } from '$lib/jsonParser';
import type { Card, Timeline } from '$lib/struct.class.svelte';

// Mock SvelteKit environment guard
vi.mock('$app/environment', () => ({
	browser: true
}));

// Mock JsonParser revivers to isolate unit tests
vi.mock('$lib/jsonParser', () => ({
	JsonParser: {
		cardsReviver: vi.fn((_key, value) => value),
		timelineReviver: vi.fn((_key, value) => value)
	}
}));

describe('test CustomLocalStorage', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	describe('save()', () => {
		it('should serialize and store string value in localStorage', () => {
			CustomLocalStorage.save('test-key', 'test-value');

			expect(localStorage.getItem('test-key')).toBe(JSON.stringify('test-value'));
		});

		it('should serialize complex objects using optional replacer', () => {
			const cardsMock = [{ key: 'c1', title: 'Card 1' }] as Array<Card>;
			const replacer = vi.fn((_k, v) => v);

			CustomLocalStorage.save(LOCAL_STORAGE.KEY_CARDS, cardsMock, replacer);

			expect(localStorage.getItem(LOCAL_STORAGE.KEY_CARDS)).toBe(JSON.stringify(cardsMock));
			expect(replacer).toHaveBeenCalled();
		});
	});

	describe('get() and getters', () => {
		it('should return null when key does not exist in localStorage', () => {
			const result = CustomLocalStorage.getTimeline('non-existent-key');

			expect(result).toBeNull();
		});

		it('should retrieve timeline and invoke timelineReviver', () => {
			const timelineMock = { key: 't1', title: 'My Timeline' } as Timeline;
			localStorage.setItem('t1', JSON.stringify(timelineMock));

			const result = CustomLocalStorage.getTimeline('t1');

			expect(result).toEqual(timelineMock);
			expect(JsonParser.timelineReviver).toHaveBeenCalled();
		});

		it('should retrieve cards and invoke cardsReviver', () => {
			const cardsMock = [{ key: 'c1' }] as Array<Card>;
			localStorage.setItem(LOCAL_STORAGE.KEY_CARDS, JSON.stringify(cardsMock));

			const result = CustomLocalStorage.getCards();

			expect(result).toEqual(cardsMock);
			expect(JsonParser.cardsReviver).toHaveBeenCalled();
		});

		it('should retrieve picto using full prefixed key', () => {
			const pictoKey = 'icon-star';
			const fullKey = LOCAL_STORAGE.KEY_PICTO + pictoKey;
			localStorage.setItem(fullKey, JSON.stringify('svg-data'));

			const result = CustomLocalStorage.getPicto(pictoKey);

			expect(result).toBe('svg-data');
		});
	});

	describe('remove() and clear()', () => {
		it('should remove specific key from localStorage', () => {
			localStorage.setItem('key-to-delete', JSON.stringify('data'));

			CustomLocalStorage.remove('key-to-delete');

			expect(localStorage.getItem('key-to-delete')).toBeNull();
		});

		it('should clear all entries from localStorage', () => {
			localStorage.setItem('k1', JSON.stringify('v1'));
			localStorage.setItem('k2', JSON.stringify('v2'));

			CustomLocalStorage.clear();

			expect(localStorage.length).toBe(0);
		});
	});
	
});

/**
 * Test for bug detected on truncated picto value in localStorage
 */
describe('test CustomLocalStorage with corrupted json', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	it('should return null if there is corrupted json', () => {

		//Mock console.error() to avoid vi console pollution
		vi.spyOn(console, 'warn').mockImplementation(() => {});

		const validPicto = `"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAyAFADAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/igD4p/bG/aX+J37PNr4Gg+Hf7MHir9pKHxzB4xg8QQ+GPHGkeC38Jx6InhuOxju21TStSa/PiNNe1EWz2z2n2H+w5/Nkd7uDZrTWHak69arSty8ipYWpiea9+a/s5R5OW0bc3xXdvhd+vCYGvjnNUK+W0fZqLk8xzLD5cpc17Kk8RpWa5XzqPwXjf40flrpv7Y/iXwudZtx/wAEdPFl3da/dJrWowa18SvCfj3U9QnjEEKSR/2p4M8TXljp8M9tFMsKvY6NBqU098ETUr+5nufRw8cLi5SpxzadGdOCkoV8LPCKVO7jzQc60IzadlK15JON9LGWZ5Zjsqw9LFTo5fjcPWrzoe1yzM8PmMaVaMI1PZ1vYRm6TnBuVNSSUlCpbVa/Slp/wUV/awtrSOC1/wCCYvjSzt7SGCC0sov2kPhDBGlvGgiigtoYdIEEEVvEqosRMKxoFSNSBtDeAwO/9qwbb1/2Wr99+f7/ANTyvrWJ/wCgJ/8Ag+H/AMgTJ/wUc/a3ZJGP/BMzxxGyBdsb/tK/CQvLnORGU0p4wVwC3mvEDkbSxyAfUMD/ANDSH/hLV/8Akw+tYn/oDf8A4Ph/8gC/8FHP2t2jkc/8EzPHCMhQLE37SvwkMku4kExlNKaICPAL+bJGSGGwOcgH1DA/9DWH/hLV/wDkw+tYn/oDf/g+H/yBJF/wUY/a1kinkf8A4JpeNLd4VVo4Jf2lPhS0t0W3ZSAwaLNCrJgbjdTWyHcu1m+bbEsFg4yhFZhzqTalOOGtGmlazmp14Tad9PZxqPR3S0vUcRiGpN4ZRcUrRlW1ne+keWlKKatrzyitVZvW3mvjf9u/9urxTNpf/CP/ALCnxF8C6NbytH4k0mx+N3wB1vUPEunTxXMMtrp+qa5oN/BoNwplhd717S9URQmOK0aWUyR7QwOXRvzZjTm2rRvh68VF92ozTknta611M3icU7Wwjjrr++g2121hp62Z4x4B+K/xg8DXWp6hN/wTP+IfjldZ1i/1zW9L+Ifxs/ZL8R/2vrGptYzz6g2ox/B+x1fTreG/0+y1O00bR9d0nQ7PUrZbm20dCzrJtOlhZxjH+1YR5YqMXDD4mLUY3SVvb8rdm05Si5NPWRKq102/qbd22061Jq7d7/wrrVXsmlfW1z9A/gJ+2r+0R8Tvid4N+HnjD9g/xP8ABvwlrc9/ZX/jm9+OHw38UWPha107QNT1Ozmbw34f02G9vre6u9PtNEigsp45LaS/iuTE1rby44a+EwlKlOpTzCNecbctJYepBzvJJ+9KTSsm5arW1upvSxFec4wlhXTi73n7WMlGybXuqKbva2h/KrYftcftYXdgl5c/tu/GnS7hpJYzpN78X/jpLqEaoshSZ5NNhv8ASjDMyIq+Xqck6iVWkgXa4X/Q6rwTwZCq6cPD7IK0Uk/bU8j4djSbdrxSqypVuZXe9FRfK7S1V/8AMmlx5xzUpKpPxI4joTcmnQqZ/wATyqxSvaTdGNWhyysrctaUknrFapfRf7LH7Zf7W6av8R7PxJ8Yvid8Ure0j8PLpF+/xQ/aG8Y2MKtLrqy3NnHb/C/xHqOkLekWizDUtO0mSYQMyLdLZkr+a8ecL8PYShlE6fBvD2VzrvGOpSwuX4L2j5Vh+WFeWDy9Um4XvHlq1Uuednp736z4c8VcRY7EZ3Cpx1xNm1PDxwKp1cbmOKjTXO8TzTw0MfnHtkp8rU/3VJvkhzJ3Sj90+Dv2nPjvO82j6v8AEj4lnVEFzqCz+KfFfjXRRc6fZppP9pnSLiT4d+DrTUIrA6tZJaQNYpqV/dzXNvlTZ3C2n5pXyjhzA4eOIxGV4GVH2lGlOrVyqhzRxFeNacaMKeGwXPOlGnQlP28qUIKTVOo4ScFL9ByrMeLFOpgqnFWeZjiJSxWJoVcVmuEjUlg6Lw9P354OGWYOk41K0FGg41sTJSnNVa8I+53lt+0b8WvIVr/4h/E2K48xEZNL1X4h6xZlLiSQWrxXyaXaecGhVHvCtuIrCVjFPMVCTSbUcm4dr0oVoZNlkoVIqUGstpWcZX5XaWHhJXWrUopxej6N9VXO+I6dSVN57micG4yUs1qRalH4l7uLnG1/hak1NWa3sdN/wuj4vf8ART/H3/hW65/8nVv/AKvZD/0Jsr/8IMN/8qOf/WTiH/oeZt/4cMV/8tD/AIXR8Xv+in+Pv/Ct1z/5Oo/1eyH/AKE2V/8AhBhv/lQf6ycQ/wDQ8zb/AMOGK/8Alof8Lo+L3/RT/H3/AIVuuf8AydR/q9kP/Qmyv/wgw3/yoP8AWTiH/oeZt/4cMV/8tD/hdHxe/wCin+Pv/Ct1z/5Oo/1eyH/oTZX/AOEGG/8AlQf6ycQ/9DzNv/Dhiv8A5aH/AAuj4vf9FP8AH3/hW65/8nUf6vZD/wBCbK//AAgw3/yoP9ZOIf8AoeZt/wCHDFf/AC0VfjV8X1IZfij4/UjoV8W66CPoRfZFH+r2Q/8AQmyv/wAIMN/8qD/WTiH/AKHmbf8AhwxX/wAtP56dL+EV/f2zz3mjyaJItx5K2eo+HfiZPdSR/uCbpW0fQdUsxb4llAV7tLovbSg2yo8EkvFL6ROZp2WecKS03VbL0lvp72YJ326W136H+e+Fnx9iKbnWyKpgZKpyKjieGOLqlSUfc/ep4PA4qiqdpSSUqqq81OSdNJwlL6y/Y80q00XUfi7oGreEfiKLa7i8Naaup+HPAXxvtUvVg1DW7R7rS9a0rQbLVbKEyXUMsN9DLp8y2rS3heO2guJYfCzzxjzDiOGGjLNeHsR9W9rK2FrYXmp+2VO/tHSxsrN+ytHVXadm7n7d4Q0+OaGIz6eYZJh6dJ0stlhKrw1ejHEK+OnKX1bG16eJhaPJelisLRrQlJU6tKFVqB9gTWH2C6sNS8H2nxQ05rWLU4bmHxl8M/2p/HcFy15HcPC8em33iDR7NPszJclZLyx1GVd9jBptxpjizM3zVTjXE1YSp1cZguWXLd0cwlh5pRmpe7Vo42NSLbSTcZxbjeEuaEpRf7zh8ZxDRqc9TJcNUlFpwSoYP2avF05e0p14YmlVTjNOKlFKE17VJzgpQ6iw0fU9ZtJry20bxWjae1lb6k+o6F8dPDb3uoaclwWutJ0PVLqzvG024AcyQWDazbXTeTHe6lqcjWpqY8d46ioUo4zLXFKKg515V5csdI+1rzxdSUpa+/KpPmlvK9j2IVpVKTrVclx0asYQliI0p5LCDqVn731ai1SqSgmtIU6Unh46yVNSOr06y8UanMBDp7wJssLpob34d+PdOK2xdxfQLfarq+nwvdzjYtsv2ZJ9P2NNd2F2kqpF0vj/ABkYrmxOVt6puNWg1fo+WNWTSXW8nfZNHzuIxGaU5VPZ5LifZ+0rRpN89WfLvRc40IyT5Y/xHF8lST5ac4W17L+wbz/oAXn/AIC6n/8AF1n/AMRBx3/QXlf/AJT/APl5xfXM+/6FNT/whx3/AMmH9g3n/QAvP/AXU/8A4uj/AIiDjv8AoLyv/wAp/wDy8Prmff8AQpqf+EOO/wDkw/sG8/6AF5/4C6n/APF0f8RBx3/QXlf/AJT/APl4fXM+/wChTU/8Icd/8mH9g3n/AEALz/wF1P8A+Lo/4iDjv+gvK/8Ayn/8vD65n3/Qpqf+EOO/+TD+wbz/AKAF5/4C6n/8XR/xEHHf9BeV/wDlP/5eH1zPv+hTU/8ACHHf/Jnhukl2smSzu9GWGGWbnVdL8EpfO8sWyRVl1q+GoTQiKVjHl2to5FPkFblFA/55su+kJl9fCzeHyGlClSqTVswx/CGHxU5yhHmUP7TrU8XUp8k24y1w6lGUacvbxUD/AF4r/QxzzCzhSnxxl83NcylQ4VzjFwim5R9+th5VoRd1bkc+dJxm4KHvL6P/AGdGiOr+OzPOj3ATQo5vsNjpMNkGhbVIh9lGj3j6a8RC8PaAQyY8xWkLsx/ZPB3xoyzPcw4rpSyjFUK2CWVxqvD1sprYWcpSx9NfV6mW1Xgp017K6qYeU6VRPnhKV3J/O8RfRbzrhSlgMTPizLcbHNFW5I/2Tj8vqUVh40ZfvKNeTqQlJV0nTnTpzg4vnjd2X0brnifwn4YgguvEviTS/D1tdT/Zba41y+03SYLi58qSf7PBNf6hbxzT+TDLN5MbNJ5UUkm3YjEfv+H46w+LlKGEyfNsTOEeeccPRhWlCF1HmlGnOTjHmko8zSV2le7R8jV8F8woJSr8Q5TRjJ8sZVYV6alKzlypzaTdk3Za2TeyZ8rzfEf9m6y1M6pb/D/wQuofbdSmt/EOn63+zPY3s9xfT30mo6haakfi1Y6okmqNYy3V3KTDeXKy7r2PzYr6O1+uw/F+ZU3TqUZ57RqUo05RisJxC5UnGFNQi1DLJwTgqyhGzcFZqEuWVN1PKl4U4q7TzrLJK7jGXtsFaWstY82YKWvI5WaUrbpOMlHa8M+NvhHd6fqn2bwn4Y1a0iiWKPStDg+D2o3Nr4fvp555TqlzYfFfxJp8unf2kslpKZ7jS4rjVLe6e2sLiLM0X0WEznG8RVZTpY7NMLjMPGE6/wDaUOK69WvUhGFP6xhqeA4VnKjTpxlSjL2spzhGvQg6jcrPxsy8P6+URpupjMNiKdZtRnhauSQpwdm1CcsZn+FTnJKbShzc3JNpWV334+OHhZQFXRPEKqoAVRqPw0AAAwAAPiNgADgAcAVp/YWKe+Kw/wD4aON//oPPK/1cl/z/AH/4V8Lf/RUa8Xxc8LyWy3Rt7yFSquY7jX/hpDKkayFbqSQN8QtiLYQbby8LOCtrIhhE8xMK/KZljpZZjZ4KvhcbOcbclWnlXEMKVdSjelKisVkmHrzjWqqeGpSdCKdenUT5aaVR/SYDw3r5jhI4ujnOXwi7qdKeJyudWi1K041nhs2xFCMqcHCtNRrSapVINXm3Benwz2FxFFcW9y88E8aTQzQxwyxTRSqHjlikS6ZJI5EZXR0Yq6kMpIINfIT8QsvpzlCeXZhCcJShOE1QjOE4tqUZRdVOMotNSi0mmmmrn0cfBHNZRUo57lsoySlGUaOJcZRaummtGmtU1o1qiTdbf89J/wDvxH/8k1P/ABEXLf8AoAx334f/AOWj/wCIIZt/0O8u/wDBGJ/yDdbf89J/+/Ef/wAk0f8AERct/wCgDHffh/8A5aH/ABBDNv8Aod5d/wCCMT/kfjxp+swSI51TVb60k8yNY10/w3ouooYiQZZXe41HS2EijIjgVCshIZriPBU/itDw+8OZKX1nhDhulLmioqhwlkVdct1zSk6kcO+ZK6jBK0nZupG1n/q5isPioyj9Tw9KvHlk5vFZvmOFlzpPkhFUsNjE4t2cqjknFJpUp3TX1F+y5q13Le+OQLgSxJHoQhd7Gyt5GjM2s7WkiiSRUdlVSyCWZY2yqyOPmb9O8MeDeD8HXzt4Hhjh/CKcMCpSwuS5dg5VYxni+R1Y4eilJxTbUZSmoOUlGXvNv8g8YKEY4fh1y9pGcpZi5xWKxFWMZcmAuoTqSjKUU20pckHJWbhF6L6//tC7/wCeif8Afi3/APjVfrn+rnD/AP0Jcr/8IcN/8rPw/wBlHvU/8HVf/kw/tC7/AOeif9+Lf/41R/q5w/8A9CXK/wDwhw3/AMrD2Ue9T/wdV/8AkzyTxwtpZst/4r+MN54U0y+1JP7NstYt/g7baTHcQWt5cS6bps3ivwDfXc5ltI57mdZb+71FLezeWG5hhS6MnrZdlOWYaUnl3D+AjW9k41amEw+KpVp03OFnVeEr0vdU1Gy5VDmavFy5beTmGX4KuovMMW1RdROlSxTwM6MZqM240/reGqO7gpNvndTli2pJKV/nRvE15N5xtfjH8IpBHcq2k7Pip8DMaxbO82oWw1HH7LFx/ZxurPVNBgaLTTqDLp81ncQXkt0zXms/RfUcMrc2VY1Xi+e+AzP93JWhLkvni5+SUKrvPl99SUope7S+d/svKmnyyyR+8vZtYvKf3sXecVP/AIQWoc8alFNQ53yOEoycm5VfSPCHji8j0qey074jeEtXksL1rrXNW8PeO/g/fWul6Xf3Drpl9q8unfCjw1BBNJp/2OdIP+EbRNrLbxatqpQXMsVeGshzDD1a2P4epYjFUklQli8izbFVeRRjy4eFd5vUo0qNTEurBc8HPnlKaceZU4cMqlbLszweGy/GYWngcRF+3pYbP+HcHQ53VqOrinhJcPxx2Jr4fBexry9hiIUXBRpuE3Cdar7T4R1zxHdi5a71XRtatBPeRy3tjrmk6zJp2oWj21t/Y8Uel+CfDVsYhGk15eyXs0moWd/M1mIprRoXtfmMZwzwzDkUMgwFCfLTahPKKVFVac1Kft26uJxUrtuMKapxVKpTSneM01P7bAqrPnc60cRT5qilUp5g67pVYOEPYJUcHhIcqSlOo6knVp1HyWlBpw7X+0Lv/non/fi3/wDjVcP+rnD/AP0Jcr/8IcN/8rPQ9lHvU/8AB1X/AOTD+0Lv/non/fi3/wDjVH+rnD//AEJcr/8ACHDf/Kw9lHvU/wDB1X/5M/lW0vwd8Qb7RNPv4rj4t6n5sTC41rT/AIh+M10a/lhWeeeXS4R8Jbv7OiQ2N6Wjk1XVDGsMzNITC1bR8O809nBvD0ZSt7845g1CT6uEf7Kk4KyejqVLd3Y/ean0r/Cl16rp0MVToczdGjU4EwdStTjZ2jWrLi+lGs02m5Qw+Hva3Kkz7m/Yq0jxvo3iT4oWk+veM9HX+x/BEn9leLfFnijVdUimefxO7XiyXXg/wiIbO8iaH7PEmnTN+5kd7yVXjVPpuHOC8ywFXG81OhTjVp4a0ZYp1p80HW5pOX1PCpRkpx5UoSejvJ3R+a+Iv0g/DXinC5PDCYfFyr4LEZjKtUhwxhsrpSpYiGDVGEaUc6zaVSpTlRqupOVenFqcFCkmpN/oLjxb/wBDbd/+DfXP/jNfVf6uY/th/wDwZ/8AaH5X/wART4F/6B8X/wCGul/8sDHi3/obbv8A8G+uf/GaP9XMf2w//gz/AO0D/iKfAv8A0D4v/wANdL/5YGPFv/Q23f8A4N9c/wDjNH+rmP7Yf/wZ/wDaB/xFPgX/AKB8X/4a6X/ywa6eLHVkPi69AdWUlNZ16NwGBBKukSujYPyujK6nBVgQDR/q5j/5cP8A+DL/AJwB+KfArTX1fGaq2mWUk9ezVVNPzTTXQ801Twk+hWqXd343+LE8TyRWKppfxK/aB8R3Qa4dykj2Wiavql7HGpLCXUZIFitk2LPdRRiMV2RybNptpU8rW8vew+AgtPOWGiv+3U9eiZ578RPD2Ovs87fTRY+fVvZY+VuvvWvayvZJEel67PrU+laDF4m+K0B2f2VptxqNt+0BoMPkRW7sJdc8R6voGkW6TkLKP7X8RatNczSmEf2nJcSQRLvUyLNf3bhHKG4048/7nKornVSTslGFT2q96N5uMJSj7sqapwTfDhfEPgGj9c9tSz7lq4urVpXrZxi37GdGjSVva1qLwa5oTawlGValSlevTrupXmodxYat4guHgsrfxR4kVvJlMb38fj21Ty7SQWz+ff6ppUMZmdhuiFzcfaL2PN1D9oiYzHhnwzmS5pyWC1ldqGIovWXve7CmnaK7Riox+HTY9qHirwGlGEcPj7KNk55Vd2jp706k+Zydt5ycp/FeV2zZx4t/6G27/wDBvrn/AMZrL/VzH9sP/wCDP/tDT/iKfAv/AED4v/w10v8A5YfzwV6h/PB+hv7An/H98Uf+vTwh/wCjvEdenlu9b0h+cjjxf/Lv/t//ANtP0jr1TjCgAoAwNd8J+FvFBtD4l8NeH/ER09pmsDrujadqxsmuVjW4a0/tC2uPszTrFEsxh2GVYow5YIuLhUqQvyTnDmtzckpRvba9mr26X2JlGMrc0YyttzJO197XWhgH4U/C5s7vht4BOXeQ58HeHTl5Ylgkc507l5IESF26vEqxsSihRf1jEf8AP+ttb+LPa97fFtfX11F7Kn/z7h/4BH/IZN8Nfh1YrJqdj4A8FWepWETXVjqFr4V0K3vrO5tVaa1uLS7hsEuLee2mVZYJYZEkhkUPGysAaI1qzcYurVcXJXTqSaevVN2ZnVp01SqNQgmqc2moxTT5W77b31OmtdE0UTW+rDSNLGqF5r06kNPtP7QN5qEOy/u/tnk/aPtV6rMt3ceZ5tyrMJncEgqdas1KDq1HB2i4upJxcYyvGLi3ZqL1irWT1VmVCnBKElCHMldS5VzJyS5ne17y6u+vU26yNT//2Q=="`
		const invalidPicto = `"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAmAKEDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/igAoAKAGSRiWOSJi6rIjxs0cjxSKHUqTHLGyyRuAcrJGyujYZGDAEAHzro/7P8Apz2uh3dx8UfjmypDZ3l9p9p8W/GGn6XqTy6dZQXVu8NrqC39hZXD2y3Ii0vUrK5gupbq4gvI57y8kuNY`
		
		localStorage.setItem('picto_validJson', validPicto)
		localStorage.setItem('picto_invalidJson', invalidPicto)
		
		expect(CustomLocalStorage.getPicto('validJson')).not.toBeNull();
		expect(CustomLocalStorage.getPicto('invalidJson')).toBeNull();
		expect(console.warn).toHaveBeenCalled();

	});


});