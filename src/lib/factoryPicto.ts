
import { LOCAL_STORAGE } from "./constantes";
import { CustomLocalStorage } from "./customLocalStorage";
import type { Timeline } from "./struct.class";

export class FactoryPicto {

    /**
     * 
     * @param timeline the object <Timeline>
     * @param binaries the binarie of the picto (data:image/jpeg;base64)
     */
	static createPicto(timeline:Timeline, binaries:string):void{
		CustomLocalStorage.save(LOCAL_STORAGE.KEY_PICTO + timeline.key, binaries)
    }

    /**
     * 
     * @param key the code of the timeline<Timeline>
     * @returns the binarie of the picto (data:image/jpeg;base64) or null
     */
    static getPicto(key:string):string{
        return CustomLocalStorage.getPicto(key)
    }
}