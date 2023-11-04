import { SSProxy } from './ss'
import { SnellProxy } from './snell'
import { TrojanProxy } from './trojan'
import { BaseProxy } from './base'
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
            return new TextPack(proxies, {
                localTitle: 'proxies:',
            })
        } else if (platform === Supported.Loon) {
            return new TextPack(proxies, {
                localTitle: '[Proxy]',
            })
        } else if (platform === Supported.QuantumultX) {
            return new TextPack(proxies, {
                localTitle: '[server_local]',
            })
        } else if (platform === Supported.Stash) {
            return new TextPack(proxies, {
                localTitle: 'proxies:',
            })
        } else if (platform === Supported.Surfboard) {
            return new TextPack(proxies, {
                localTitle: '[Proxy]',
            })
        } else if (platform === Supported.Surge) {
            return new TextPack(proxies, {
                localTitle: '[Proxy]',
            })
        } else {
            return new TextPack(proxies)
        }
    }
}

export { BaseProxy, ProxyCtr, SSProxy, SnellProxy, SupportedProxy, TrojanProxy }
