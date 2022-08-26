import { SSProxy } from './ss'
import { SnellProxy } from './snell'
import { TrojanProxy } from './trojan'
import { BaseProxy } from './base'
import { CTR } from '../utils'
import { NotSupportedError } from '../constants'
import { TextPack } from '../textpack'
import { Supported } from '../types'

type SupportedProxy = SSProxy | SnellProxy | TrojanProxy

class ProxyCtr<T extends BaseProxy = BaseProxy> extends CTR<T> {
    public add(proxy: T): void {
        this.push(proxy)
    }

    public with_group(group: string): T[] {
        return this._items.filter((proxy) => proxy.prop.groups.includes(group))
    }

    public stringify(platform: Supported): TextPack {
        const proxies = this._stringify(platform).join('\n')
        if (platform === Supported.Clash) {
            return new TextPack('clash.proxies', proxies, (t) => {
                return t.replace(/^/, 'proxies:\n')
            })
        } else if (platform === Supported.Surge) {
            return new TextPack('surge.proxies', proxies)
        } else if (platform === Supported.QuantumultX) {
            return new TextPack('quantumultX.proxies', proxies)
        } else {
            throw new NotSupportedError(platform)
        }
    }
}

export { BaseProxy, ProxyCtr, SSProxy, SnellProxy, SupportedProxy, TrojanProxy }
