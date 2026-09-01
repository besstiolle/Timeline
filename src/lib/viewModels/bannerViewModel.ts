import { DAYS, DIFF, GRID, MONTHS } from '$lib/constantes';

export class JalonsViewModel{
    #left: number;
	#label: string;
	#classCss: string;

    constructor(left: number, label: string, classCss: string){
        this.#left = left
        this.#label = label
        this.#classCss = classCss
    }

    get left():number{
        return this.#left
    }
    get label():string{
        return this.#label
    }
    get classCss():string{
        return this.#classCss
    }
}

export class BannerViewModel{
 	#start: Date;
	#end: Date;
	#differencial: string;

    constructor(start: Date, end: Date, differencial: string){
        this.#start = start
        this.#end = end
        this.#differencial = differencial
    }

    get jalonsVM(): JalonsViewModel[] {
        let dateIncremental = new Date(this.#start);
        const msStart = this.#start.getTime();
        const msEnd = this.#end.getTime();
        const differencial = this.#differencial;

        let i = 0;
        const milestonesVM: JalonsViewModel[] = [];
        let innerClassCss: string;
        let innerLabel: number | string = '';
        let left: number;

        while (i < 100 && this.#end.getTime() >= dateIncremental.getTime()) {
        
            i++;
            left = ((dateIncremental.getTime() - msStart) / (msEnd - msStart)) * GRID.MIDDLE_WIDTH;
            innerClassCss = '';

            if (differencial === DIFF.isMoreThan20Years) {
                innerLabel = dateIncremental.getUTCFullYear();
                dateIncremental = new Date(dateIncremental.setFullYear(dateIncremental.getFullYear() + 2));
            } else if (differencial === DIFF.isBetween10YearsAnd20Years) {
                innerLabel = dateIncremental.getUTCFullYear();
                dateIncremental = new Date(dateIncremental.setFullYear(dateIncremental.getFullYear() + 1));
            } else if (differencial === DIFF.isBetween6YearsAnd10Years) {
                innerLabel =
                    dateIncremental.getMonth() == 0
                        ? dateIncremental.getUTCFullYear()
                        : MONTHS[dateIncremental.getMonth()];
                dateIncremental = new Date(dateIncremental.setMonth(dateIncremental.getMonth() + 6));
            } else if (differencial === DIFF.isBetween3YearsAnd6Years) {
                innerLabel =
                    dateIncremental.getMonth() == 0
                        ? dateIncremental.getUTCFullYear()
                        : MONTHS[dateIncremental.getMonth()];
                innerClassCss = dateIncremental.getMonth() == 0 ? 'newYear' : '';
                dateIncremental = new Date(dateIncremental.setMonth(dateIncremental.getMonth() + 3));
            } else if (differencial === DIFF.isBetween20MonthsAnd3Years) {
                innerLabel =
                    dateIncremental.getMonth() == 0
                        ? dateIncremental.getUTCFullYear()
                        : MONTHS[dateIncremental.getMonth()];
                innerClassCss = dateIncremental.getMonth() == 0 ? 'newYear' : '';
                dateIncremental = new Date(dateIncremental.setMonth(dateIncremental.getMonth() + 2));
            } else if (differencial === DIFF.isBetween5MonthsAnd20Months) {
                innerLabel =
                    dateIncremental.getMonth() == 0
                        ? dateIncremental.getUTCFullYear()
                        : MONTHS[dateIncremental.getMonth()];
                innerClassCss = dateIncremental.getMonth() == 0 ? 'newYear' : '';
                dateIncremental = new Date(dateIncremental.setMonth(dateIncremental.getMonth() + 1));
            } else if (differencial === DIFF.isBetween1MonthAnd5Months) {
                innerLabel = dateIncremental.getDate() + '/' + (dateIncremental.getMonth() + 1);
                innerClassCss = dateIncremental.getDate() < 8 ? 'newYear' : '';
                dateIncremental = new Date(dateIncremental.setDate(dateIncremental.getDate() + 7));
            } else if (differencial === DIFF.isBelow1Month) {
                innerLabel = dateIncremental.getDay() == 0 ? DAYS[0] : dateIncremental.getDate();
                innerClassCss = dateIncremental.getDay() == 0 ? 'newYear' : '';
                dateIncremental = new Date(dateIncremental.setDate(dateIncremental.getDate() + 1));
            }

            milestonesVM.push(new JalonsViewModel(left, innerLabel as string, innerClassCss));
        }

        return milestonesVM
    }
}