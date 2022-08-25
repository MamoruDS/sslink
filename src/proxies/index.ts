import { SSProxy } from './ss'
import { SnellProxy } from './snell'
import { TrojanProxy } from './trojan'
import { Supported } from '../types'
import { BaseProxy } from './base'
import { CTR } from '../utils'

type SupportedProxy = SSProxy | SnellProxy | TrojanProxy

class ProxyCtr<T extends BaseProxy = BaseProxy> extends CTR<T> {
    public add(proxy: T): void {
        this._items.push(proxy)
    }

    public with_group(group: string): T[] {
        return this._items.filter((proxy) => proxy.prop.groups.includes(group))
    }
}

export { BaseProxy, ProxyCtr, SSProxy, SnellProxy, SupportedProxy, TrojanProxy }
