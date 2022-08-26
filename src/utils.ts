import { TextPack } from './textpack'
import { Supported } from './types'

interface _PlatItem {
    parse(platform: Supported): string
}

class CTR<T extends _PlatItem> {
    protected _items: T[]
    protected _push_ignore_repeat: boolean

    constructor() {
        this._items = []
        this._push_ignore_repeat = false
    }

    get items(): T[] {
        return this._items
    }

    public push(...items: (T | undefined)[]): void {
        for (const item of items) {
            if (isUndef(item)) {
                continue
            }
            if (!this._push_ignore_repeat) {
                if (this._items.includes(item)) {
                    continue
                }
            }
            this._items.push(item)
        }
    }

    protected _stringify(platform: Supported): string[] {
        return this._items.map((item) => item.parse(platform))
    }

    public stringify(platform: Supported): TextPack {
        return new TextPack('unknown', this._stringify(platform).join('\n'))
    }
}

const isUndef = (x: any): boolean => {
    return typeof x === 'undefined'
}

const optionalArgs = (key: string, val?: any): string => {
    if (typeof val != 'undefined') {
        return key + '=' + val
    } else {
        return undefined
    }
}

const undefinedFreeJoin = <T = any>(
    arr: T[],
    separator: string
    // filter: (x: T) => boolean
): string => {
    return arr.filter((x) => typeof x != 'undefined').join(separator)
}

export { CTR, isUndef, optionalArgs, undefinedFreeJoin }
