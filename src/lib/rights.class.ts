
export class Rights {

    o: string|null = null
    w: string|null = null
    r: string|null = null

    constructor(args:any = null){
        if(args instanceof(URLSearchParams)){
            this.__constructorURLSearchParams(args)
        } else {
            this.r = null
            this.w = null
            this.o = args
        }
    }

    __constructorURLSearchParams(searchParams: URLSearchParams){
        this.o = searchParams.get('o')
        this.w = searchParams.get('w')
        this.r = searchParams.get('r')
        if(this.r){
            this.w = null
            this.o = null
        }
        if(this.w){
            this.o = null
        }
    }

    isNone(){
        return this.r === null && this.w === null && this.o === null
    }
    
    isReader(){
        return this.r !== null && this.w === null && this.o == null
    }

    isWriter(){
        return this.r === null && this.w !== null && this.o === null
    }

    isOwner(){
        return this.r === null && this.w === null && this.o !== null
    }

    hasReader(){
        return this.r !== null || this.w !== null || this.o !== null
    }

    hasWriter(){
        return this.w !== null || this.o !== null
    }

    hasOwner(){
        return this.o !== null
    }

    getTimelineField(){
        if(this.isReader()){
            return 'readKey'
        }
        if(this.isWriter()){
            return 'writeKey'
        }
        if(this.isOwner()){
            return 'ownerKey'
        }
        return null
    }

    getSlugParamKeyName(){
        if(this.isReader()){
            return 'r'
        }
        if(this.isWriter()){
            return 'w'
        }
        if(this.isOwner()){
            return 'o'
        }
        return null
    }

    getSlugParamKeyValue(){
        if(this.isReader()){
            return this.r
        }
        if(this.isWriter()){
            return this.w
        }
        if(this.isOwner()){
            return this.o
        }
        return null
    }
}