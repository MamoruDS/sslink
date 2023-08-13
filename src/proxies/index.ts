import { SSProxy } from './ss'
import { SnellProxy } from './snell'
import { TrojanProxy } from './trojan'
import { BaseProxy } from './base'
import { NotSupportedError } from '../errors'
import { TextPack } from '../textpack'
import { Supported } from '../types'
import { CTR, ParseFlags } from '../utils'

type SupportedProxy = SSProxy | SnellProxy | TrojanProxy

class ProxyCtr<T extends BaseProxy = BaseProxy> extends CTR<T> {
    public add(proxy: T): void {
        this.push(proxy)
    }

    public with_group(group: string): T[] {
        return this._items.filter((proxy) => proxy.prop.groups.includes(group))
    }

    // TODO: is this necessary?
    public stringify(platform: Supported, parseFlags: ParseFlags): TextPack {
        const proxies = this._stringify(platform, parseFlags).join('\n')
        if (platform === Supported.Clash) {
            return new TextPack('clash.proxies', proxies, (t) => {
                return t.replace(/^/, 'proxies:\n')
            })
        } else if (platform === Supported.Surge) {
            return new TextPack('surge.proxies', proxies)
        } else if (platform === Supported.QuantumultX) {
            return new TextPack('quantumultX.proxies', proxies)
        } else if (platform === Supported.Loon) {
            return new TextPack('quantumultX.proxies', proxies)
        } else if (platform === Supported.Surfboard) {
            return new TextPack('quantumultX.proxies', proxies)
        } else if (platform === Supported.Stash) {
            return new TextPack('quantumultX.proxies', proxies)
        } else {
            throw new NotSupportedError(platform)
        }
    }
}

export { BaseProxy, ProxyCtr, SSProxy, SnellProxy, SupportedProxy, TrojanProxy }
