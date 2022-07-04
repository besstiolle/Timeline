
export const GRID = {
    ALL_WIDTH:1000,
    LEFT_WIDTH:150,
    RIGHT_WIDTH:75,
    MIDDLE_WIDTH:(1000 - 150 - 75),
    LEFT_X:0,
    RIGHT_X:(1000-75),
    MIDDLE_X:150,

    MILESTONE_H:50,
    ANNUAL_H:65,
    ONE_TASK_H:30,
    TODAY_H:0
}

export const MONTHS = ['Jan.','Fev.','Mar.','Avr.','Mai','Juin','Juil.','Aout','Sept.','Oct.','Nov.','Dec.']

export const DAYS = ['Di.', 'Lu.','Ma.','Me.','Je.','Ve.','Sa.']

export const LIVE_PREFIX = {
    TS:"taskStart_",
    TE:"taskEnd_",
    MD:"milestoneDate_",
    PR:"progress_",
    TSF:"timelineStartFocus",
    TEF:"timelineEndFocus",
}

export const LOCAL_STORAGE = {
    KEY_CARDS : "cards",
    KEY_PICTO : "picto_"
}

export const COLORS = [
    ["rgba(41, 128, 185, 0.5)", "rgba(41, 128, 185, 1)"],
    ["rgba(22, 160, 133, 0.5)", "rgba(22, 160, 133, 1)"],
    ["rgba(155, 187, 89, 0.5)", "rgba(155, 187, 89, 1)"],
    ["rgba(243, 156, 18, 0.5)", "rgba(243, 156, 18, 1)"],
    ["rgba(235, 130, 88, 0.5)", "rgba(235, 130, 88, 1)"],
    ["rgba(192, 57, 43, 0.5)", "rgba(192, 57, 43, 1)"],
    ["rgba(123, 114, 99, 0.5)", "rgba(123, 114, 99, 1)"],
    ["rgba(149, 165, 166, 0.5)", "rgba(149, 165, 166, 1)"],
    ["rgba(75, 44, 80, 0.5)", "rgba(75, 44, 80, 1)"],    
]

export const TIMERS = {
    DAYS31 : 86400000 * 31, // < 31 days
    MONTHS5 : 86400000 * 30 * 5, // < 5 months (+/-)
    MONTHS20 : 86400000 * 30 * 20, // < 20 months (+/-)
    YEARS3 : 86400000 * 30 * 12 * 3, // < 3 years (+/-)
    YEARS6 : 86400000 * 30 * 12 * 6, // < 6 years (+/-)
    YEARS10 : 86400000 * 30 * 12 * 10, // < 10 years (+/-)
    YEARS20 : 86400000 * 30 * 12 * 20, // < 20 years (+/-)
}

export const DIFF = {
    isMoreThan20Years : "isMoreThan20Years",
    isBetween10YearsAnd20Years : "isBetween10YearsAnd20Years",
    isBetween6YearsAnd10Years : "isBetween6YearsAnd10Years",
    isBetween3YearsAnd6Years : "isBetween3YearsAnd6Years",
    isBetween20MonthsAnd3Years : "isBetween20MonthsAnd3Years",
    isBetween5MonthsAnd20Months : "isBetween5MonthsAnd20Months",
    isBetween1MonthAnd5Months : "isBetween1MonthAnd5Months",
    isBelow1Month : "isBelow1Month"
}