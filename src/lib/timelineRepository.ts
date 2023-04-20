import type { Struct } from "./struct.class";
import { NotFoundOnlineException } from "./timelineException.class";

const endpoint = import.meta.env.VITE_API_ENDPOINT_BASE_URL + '.netlify/functions/timeline?'

export async function create(timeline : Struct.Timeline): Promise<createJsonResponseinterface>{
    //console.info("POST on endpoint : " + endpoint)
    if(!timeline.ownerKey && !timeline.writeKey){
        throw new Error("at least you must provide one of theses : ownerKey or writeKey in timeline object")
    }

    const res = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(timeline)
    })

    return await res.json()
}

export async function get(params: URLSearchParams): Promise<getJsonResponseinterface>{
    //console.info("GET on endpoint : " + endpoint + params)
    const res = await fetch(endpoint + params, {
        method: 'GET',
    }).then(res => {
        if(res.status == 404){
            throw new NotFoundOnlineException()
        }
        return res
    })

    return await res.json()
}


export async function remove(params: URLSearchParams): Promise<string>{
    //console.info("DELETE on endpoint : " + endpoint + params)
    const res = await fetch(endpoint + params, {
        method: 'DELETE',
    })

    return await res.json()
}

export interface createJsonResponseinterface{
    message:{
        ts:number
    }
}

export interface getJsonResponseinterface{
    message:{
        data:string
        ts:number
    }
}
