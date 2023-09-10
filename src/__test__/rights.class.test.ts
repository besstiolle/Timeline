
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Rights } from "$lib/rights.class";




describe('test Right.class functions', () => {

    it('Test Rights() with fakes values', () => {
        let rights = new Rights(new URLSearchParams([['foo','bar'],['bar','foo']]))

        expect(rights.hasOwner()).toBe(false)
        expect(rights.hasWriter()).toBe(false)
        expect(rights.hasReader()).toBe(false)
        expect(rights.isOwner()).toBe(false)
        expect(rights.isWriter()).toBe(false)
        expect(rights.isReader()).toBe(false)
        expect(rights.isNone()).toBe(true)
        expect(rights.getTimelineField()).toBe(null)
        expect(rights.getSlugParamKeyName()).toBe(null)
        expect(rights.getSlugParamKeyValue()).toBe(null)
    })
    it('Test Rights() with reader values', () => {
        let rights = new Rights(new URLSearchParams([['foo','bar'],['r','foo']]))

        expect(rights.hasOwner()).toBe(false)
        expect(rights.hasWriter()).toBe(false)
        expect(rights.hasReader()).toBe(true)
        expect(rights.isOwner()).toBe(false)
        expect(rights.isWriter()).toBe(false)
        expect(rights.isReader()).toBe(true)
        expect(rights.isNone()).toBe(false)
        expect(rights.getTimelineField()).toBe("readKey")
        expect(rights.getSlugParamKeyName()).toBe("r")
        expect(rights.getSlugParamKeyValue()).toBe('foo')
    })
    it('Test Rights() with writer values', () => {
        let rights = new Rights(new URLSearchParams([['foo','bar'],['w','foo']]))

        expect(rights.hasOwner()).toBe(false)
        expect(rights.hasWriter()).toBe(true)
        expect(rights.hasReader()).toBe(true)
        expect(rights.isOwner()).toBe(false)
        expect(rights.isWriter()).toBe(true)
        expect(rights.isReader()).toBe(false)
        expect(rights.isNone()).toBe(false)
        expect(rights.getTimelineField()).toBe("writeKey")
        expect(rights.getSlugParamKeyName()).toBe("w")
        expect(rights.getSlugParamKeyValue()).toBe('foo')
    })
    it('Test Rights() with owner values', () => {
        let rights = new Rights(new URLSearchParams([['foo','bar'],['o','foo']]))

        expect(rights.hasOwner()).toBe(true)
        expect(rights.hasWriter()).toBe(true)
        expect(rights.hasReader()).toBe(true)
        expect(rights.isOwner()).toBe(true)
        expect(rights.isWriter()).toBe(false)
        expect(rights.isReader()).toBe(false)
        expect(rights.isNone()).toBe(false)
        expect(rights.getTimelineField()).toBe("ownerKey")
        expect(rights.getSlugParamKeyName()).toBe("o")
        expect(rights.getSlugParamKeyValue()).toBe('foo')
    })
    it("Test Rights() with multiples / reader values", () => {
        let rights_R = new Rights(new URLSearchParams([['w','bar'],['o','foo'],['r','zoo']]))

        expect(rights_R.hasOwner()).toBe(false)
        expect(rights_R.hasWriter()).toBe(false)
        expect(rights_R.hasReader()).toBe(true)
        expect(rights_R.isOwner()).toBe(false)
        expect(rights_R.isWriter()).toBe(false)
        expect(rights_R.isReader()).toBe(true)
        expect(rights_R.isNone()).toBe(false)
        expect(rights_R.getTimelineField()).toBe("readKey")
        expect(rights_R.getSlugParamKeyName()).toBe("r")
        expect(rights_R.getSlugParamKeyValue()).toBe('zoo')
    })

    it('Test Rights() with multiples / writer values', () => {
        let rights = new Rights(new URLSearchParams([['w','bar'],['o','foo']]))
    
        expect(rights.hasOwner()).toBe(false)
        expect(rights.hasWriter()).toBe(true)
        expect(rights.hasReader()).toBe(true)
        expect(rights.isOwner()).toBe(false)
        expect(rights.isWriter()).toBe(true)
        expect(rights.isReader()).toBe(false)
        expect(rights.isNone()).toBe(false)
        expect(rights.getTimelineField()).toBe("writeKey")
        expect(rights.getSlugParamKeyName()).toBe("w")
        expect(rights.getSlugParamKeyValue()).toBe('bar')
    })

    it('testConstructorWithString', () => {
        let rights = new Rights("foo")
    
        expect(rights.hasOwner()).toBe(true)
        expect(rights.hasWriter()).toBe(true)
        expect(rights.hasReader()).toBe(true)
        expect(rights.isOwner()).toBe(true)
        expect(rights.isWriter()).toBe(false)
        expect(rights.isReader()).toBe(false)
        expect(rights.isNone()).toBe(false)
        expect(rights.getTimelineField()).toBe("ownerKey")
        expect(rights.getSlugParamKeyName()).toBe("o")
        expect(rights.getSlugParamKeyValue()).toBe('foo')
    })
})
