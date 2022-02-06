export module Constantes {

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

    export const LIVE_PREFIX = {
        TS:"taskStart_",
        TE:"taskEnd_",
        MD:"milestoneDate_"
    }

    export const LOCAL_STORAGE = {
        KEY_CARDS : "cards"
    }

    export const ACCESS={
        READ:"r",
        WRITE:"w",
        OWNER:"o",
        LOCAL:"g"
    }
}