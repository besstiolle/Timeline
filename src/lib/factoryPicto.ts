
import { LOCAL_STORAGE } from "./constantes";
import { CustomLocalStorage } from "./customLocalStorage";
import type { Struct } from "./struct.class";

export namespace FactoryPicto {

    /**
     * 
     * @param timeline the object <Struct.Timeline>
     * @param binaries the binarie of the picto (data:image/jpeg;base64)
     */
	export function createPicto(timeline:Struct.Timeline, binaries:string):void{
		CustomLocalStorage.save(LOCAL_STORAGE.KEY_PICTO + timeline.key, binaries)
    }

    /**
     * 
     * @param key the code of the timeline<Timeline>
     * @returns the binarie of the picto (data:image/jpeg;base64) or null
     */
    export function getPicto(key:string):string{
        return CustomLocalStorage.getPicto(key)
    }
}