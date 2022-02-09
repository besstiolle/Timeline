import type { Struct } from "./struct.class";

const endpoint = import.meta.env.VITE_API_ENDPOINT_BASE_URL + '.netlify/functions/timeline?'

export async function create(timeline : Struct.Timeline): Promise<string>{
    
    //console.info("POST on endpoint : " + endpoint)

    if(!timeline.ownerKey && !timeline.writeKey){
        throw "at least you must provide one of theses : ownerKey or writeKey in timeline object"
    }

    const res = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(timeline)
    })

    return await res.json()
}

export async function get(key: string, ownerKey?: string, writeKey?: string, readKey?: string): Promise<string>{
    
    
    let params: URLSearchParams = null
    if(ownerKey){
        params =  new URLSearchParams({key: key, ownerKey: ownerKey})
    } else if(writeKey){
        params =  new URLSearchParams({key: key, writeKey: writeKey})
    } else if(readKey){
        params =  new URLSearchParams({key: key, readKey: readKey})
    } else {
        throw "at least you must provide one of theses : ownerKey, writeKey or readKey"
    }

    //console.info("GET on endpoint : " + endpoint + params)

    const res = await fetch(endpoint + params, {
        method: 'GET',
    })

    return await res.json()
}


export async function remove(key: string, ownerKey?: string): Promise<string>{
    
    let params: URLSearchParams = null
    if(ownerKey){
        params =  new URLSearchParams({key: key, ownerKey: ownerKey})
    } else {
        throw "you must provide ownerKey"
    }

    //console.info("DELETE on endpoint : " + endpoint + params)

    const res = await fetch(endpoint + params, {
        method: 'DELETE',
    })

    return await res.json()
}