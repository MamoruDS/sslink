import { NotImplementedError, NotSupportedError } from '../errors'
import { BaseProxy } from '../proxies'
import { SpecialProxy, Supported } from '../types'

type ValidPolicyItem = string | BaseProxy | BasePolicy | SpecialProxy

const parse_valid_policy_item = (
    item: ValidPolicyItem,
    _platform: Supported
): string => {
    if (typeof item === 'string') {
        return item
    } else if (item instanceof BaseProxy) {
        return item.prop.tag
    } else if (item instanceof SpecialProxy) {
        return item.toString() // TODO:
    } else if (item instanceof BasePolicy) {
        return item.name
    } else {
        throw new Error('Unknown policy item')
    }
}

class UnsupportedProxyError<T extends BasePolicy> extends NotSupportedError {
    policy: T
    constructor(proxy: T, platform: Supported, desc?: string) {
        super(platform, desc)
        this.policy = proxy
    }
}

class BasePolicy {
    public readonly name: string
    protected _items: ValidPolicyItem[]

    public get items(): ValidPolicyItem[] {
        return this._items
    }

    public get proxies(): BaseProxy[] {
        return this._items.filter(
            (item) => item instanceof BaseProxy
        ) as BaseProxy[]
    }

    constructor(name: string, items: ValidPolicyItem[] = []) {
        this.name = name
        this._items = items
    }

    public add(proxy: ValidPolicyItem): void {
        this._items.push(proxy)
    }

    protected _parseItems(platform: Supported): string[] {
        return this._items.map((item) => {
            return parse_valid_policy_item(item, platform)
        })
    }

    public parse(platform: Supported): string | undefined {
        throw new NotImplementedError()
    }
}

export {
    parse_valid_policy_item,
    BasePolicy,
    SpecialProxy,
    UnsupportedProxyError,
    ValidPolicyItem,
}
