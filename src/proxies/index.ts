import { SSProxy } from './ss'
import { SnellProxy } from './snell'
import { TrojanProxy } from './trojan'
import { Supported } from '../types'
import { BaseProxy } from './base'

type SupportedProxy = SSProxy | SnellProxy | TrojanProxy

class ProxyCtr<T extends BaseProxy = BaseProxy> {
    private _proxies: T[]

    constructor() {
        this._proxies = []
    }

    public add(proxy: T): void {
        this._proxies.push(proxy)
    }

    public filter(fn: (proxy: T) => boolean): ProxyCtr<T> {
        const proxies = this._proxies.filter(fn)
        const ctr = new ProxyCtr<T>()
        for (let proxy of proxies) {
            ctr.add(proxy)
        }
        return ctr
    }

    public with_group(group: string): T[] {
        return this._proxies.filter((proxy) =>
            proxy.prop.groups.includes(group)
        )
    }

    public stringify(platform: Supported): _Proxies {
        let proxies = []
        for (let proxy of this._proxies) {
            proxies.push(proxy.parse(platform))
        }
        return new _Proxies(
            platform,
            this._proxies.map((proxy) => proxy.parse(platform)).join('\n')
        )
    }
}

class _Proxies {
    public readonly body: string
    private readonly _platform: Supported

    constructor(platform: Supported, body: string) {
        this.body = body
        this._platform = platform
    }

    toString(): string {
        if (this._platform === Supported.Clash) {
            return ['---', 'proxies:', this.body, '...'].join('\n')
        }
        return this.body
    }
}

export { BaseProxy, ProxyCtr, SSProxy, SnellProxy, SupportedProxy, TrojanProxy }
