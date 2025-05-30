import type { ResponseWithMeta } from "../routes/api/timeline/types";

const endpoint = '/api/about'
const headers = {
    'content-type':'application/json'
}

export async function get(): Promise<ResponseWithMeta>{
    //console.info("POST on endpoint : " + endpoint)
    
    const res = await fetch(endpoint, {
        method: 'GET',
        headers: headers
    })

    return await res.json()
}
