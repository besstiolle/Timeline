import { FactoryMilestone } from './factoryMilestone';
import { FactoryTask } from './factoryTask';
import type {
	abstractMilestoneInterface,
	abstractTaskInterface,
	abstractTimelineInterface,
	Timeline
} from './struct.class';

const RC: string = '\r\n';
const SEPARATOR: string = ';';
const VERSION: string = '1.1';

export function goCsv(currentTimeline: Timeline): string {
	let buffer = '';

	buffer += 'version' + SEPARATOR + VERSION + RC;
	buffer += 'title' + SEPARATOR + currentTimeline.title + RC;
	buffer += currentTimeline.tasks.map((e) => FactoryTask.join(e, SEPARATOR)).join(RC) + RC;
	buffer +=
		currentTimeline.milestones.map((e) => FactoryMilestone.join(e, SEPARATOR)).join(RC) + RC;

	return buffer;
}

export function parseCsv(csvContent: string): abstractTimelineInterface {
	let elmts: string[];

	//TODO add more controls
	const abstractTasks: abstractTaskInterface[] = [];
	const abstractMilestones: abstractMilestoneInterface[] = [];
	const abstractTimeline: abstractTimelineInterface = {
		tasks: abstractTasks,
		milestones: abstractMilestones,
		title: '',
		version: ''
	};

	csvContent.split(/\r?\n/).forEach((line: string) => {
		elmts = line.split(';');
		if ('version' == elmts[0]) {
			abstractTimeline['version'] = elmts[1];
		}
		if ('title' == elmts[0]) {
			abstractTimeline['title'] = elmts[1];
		}
		if ('task' == elmts[0]) {
			if (abstractTimeline['version'] === '1.0') {
				abstractTimeline.tasks.push({
					label: elmts[1],
					isShow: elmts[2] === 'TRUE' || elmts[2] === 'true',
					start: elmts[3],
					end: elmts[4],
					hasProgress: true,
					progress: Number(elmts[5]),
					swimline: elmts[6]
				});
			} else if (abstractTimeline['version'] === '1.1') {
				abstractTimeline.tasks.push({
					label: elmts[1],
					isShow: elmts[2] === 'TRUE' || elmts[2] === 'true',
					start: elmts[3],
					end: elmts[4],
					hasProgress: elmts[2] === 'TRUE' || elmts[2] === 'true',
					progress: Number(elmts[6]),
					swimline: elmts[7]
				});
			} else {
				console.error('incorrect version of the CSV detected');
			}
		}
		if ('milestone' == elmts[0]) {
			const abstractMilestone: abstractMilestoneInterface = {
				label: elmts[1],
				isShow: elmts[2] === 'TRUE' || elmts[2] === 'true',
				date: elmts[3]
			};
			abstractTimeline.milestones.push(abstractMilestone);
		}
	});

	return abstractTimeline;
}
