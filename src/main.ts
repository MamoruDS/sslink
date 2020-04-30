import { decodeBase64, encodeBase64, Optional, assignDefault } from './utils'

// type proxy = {
//     sslink:
// }

type Protocols = 'ss' | 'trojan'

type Parsers = 'quantumult'

class BaseProxy {
    public readonly server: string
    public readonly port: number
    public readonly tag: string

    constructor(tag: string, server: string, port: number) {
        this.tag = tag
        this.server = server
        this.port = port
    }

    parse(parser: Parsers) {
        return parsers[parser](this)
    }
}

type SSMethods =
    | 'rc4'
    | 'rc4-md5'
    | 'aes-128-gcm'
    | 'aes-192-gcm'
    | 'aes-256-gcm'
    | 'aes-128-cfb'
    | 'aes-192-cfb'
    | 'aes-256-cfb'
    | 'aes-128-ctr'
    | 'aes-192-ctr'
    | 'aes-256-ctr'
    | 'chacha20'
    | 'chacha20-ietf'
    | 'chacha20-ietf-poly1305'
    | 'xchacha20-ietf-poly1305'

type ObfPluginTypes = 'http' | 'tls'
type V2RayPluginTypes = 'websocket' | 'http2' | 'mkcp'

type ObfsPluginOptions = {
    type: ObfPluginTypes
    host?: string
}

type V2rayPluginOptions = {
    type: V2RayPluginTypes
    host?: string
    tls?: boolean
    tls13?: boolean // quanx only
}

type SSOptions = {
    obfs_plugin?: ObfsPluginOptions
    v2ray_plugin?: V2rayPluginOptions
    fast_open: boolean
    udp_relay: boolean
}

const defaultSSOptions: Required<SSOptions> = {
    obfs_plugin: {
        type: undefined,
    },
    v2ray_plugin: {
        type: undefined,
    },
    fast_open: false,
    udp_relay: false,
}

type SSProxyCtor = {
    new (
        tag: string,
        server: string,
        port: number,
        method: SSMethods,
        password: string,
        options?: Optional<SSOptions>
    ): SSProxy
}

export class SSProxy extends BaseProxy {
    public readonly method: SSMethods
    public readonly password: string
    public readonly obfs?: ObfsPluginOptions
    public readonly v2ray?: V2rayPluginOptions
    public readonly fastOpen: boolean
    public readonly udpRelay: boolean

    constructor(...P: ConstructorParameters<SSProxyCtor>)
    constructor(
        tag: string,
        server: string,
        port: number,
        method: SSMethods,
        password: string,
        options?: Optional<SSOptions>
    ) {
        super(tag, server, port)
        const _options = assignDefault(defaultSSOptions, options)
        this.method = method
        this.password = password
        this.obfs = _options.obfs_plugin
        this.v2ray = _options.v2ray_plugin
        this.fastOpen = _options.fast_open
        this.udpRelay = _options.udp_relay
    }
}

type TrojanOptions = {
    certVerif: boolean
    tls13: boolean
    fast_open: boolean
    udp_relay: boolean
}

const defaultTrojanOptions: Required<TrojanOptions> = {
    certVerif: true,
    tls13: false,
    fast_open: false,
    udp_relay: false,
}

type TrojanProxyCtor = {
    new (
        tag: string,
        server: string,
        port: number,
        password: string,
        tls: boolean,
        options?: Optional<TrojanOptions>
    ): TrojanProxy
}
export class TrojanProxy extends BaseProxy {
    public readonly username?: string
    public readonly password?: string
    public readonly tls?: boolean
    public readonly certVerif?: boolean
    public readonly tls13?: boolean
    public readonly fastOpen: boolean
    public readonly udpRelay: boolean

    constructor(...P: ConstructorParameters<TrojanProxyCtor>)
    constructor(
        tag: string,
        server: string,
        port: number,
        password: string,
        tls: boolean = true,
        options?: Optional<TrojanOptions>
    ) {
        super(tag, server, port)
        const _options = assignDefault(defaultTrojanOptions, options)
        this.password = password
        this.tls = tls
        this.certVerif = _options.certVerif
        this.tls13 = _options.tls13
        this.fastOpen = _options.fast_open
        this.udpRelay = _options.udp_relay
    }
}

const parsers = {} as {
    [key in string]: (item: BaseProxy) => string
}

type parser<K extends string = ''> = K extends keyof typeof parsers ? K : never

export const quantumultParser = (proxy: SSProxy | TrojanProxy): string => {
    if (proxy instanceof SSProxy) {
        const _p = {} as {
            [key in string]: string
        }
        _p['shadowsocks'] = proxy.server + ':' + proxy.port
        _p['method'] = proxy.method
        _p['password'] = proxy.password
        if (proxy.obfs.type) {
            _p['obfs'] = proxy.obfs.type
            _p['obfs-host'] = proxy.obfs.host
            _p['obfs-uri'] =
                proxy.obfs.type == 'http' ? '/resource/file' : undefined
        } else if (proxy.v2ray.type) {
            _p['obfs'] = proxy.v2ray.tls ? 'wss' : 'ws'
            _p['obfs-host'] = proxy.v2ray.host
            _p['obfs-uri'] = proxy.v2ray.tls ? '/ws' : undefined
            _p['tls13'] = proxy.v2ray.tls13 ? 'true' : undefined
        }
        _p['fast-open'] = proxy.fastOpen ? 'true' : 'false'
        _p['udp-relay'] = proxy.udpRelay ? 'true' : 'false'
        _p['tag'] = proxy.tag
        const res = [] as string[]
        Object.keys(_p).map((k) => {
            if (_p[k]) res.push(k + '=' + _p[k])
        })
        return res.join(', ')
    }
    if (proxy instanceof TrojanProxy) {
        const _p = {} as {
            [key in string]: string
        }
        _p['trojan'] = proxy.server + ':' + proxy.port
        _p['password'] = proxy.password
        _p['over-tls'] = proxy.tls ? 'true' : 'false'
        _p['tls-verification'] = proxy.certVerif ? 'true' : 'false'
        _p['tls13'] = proxy.tls13 ? 'true' : undefined
        _p['fast-open'] = proxy.fastOpen ? 'true' : 'false'
        _p['udp-relay'] = proxy.udpRelay ? 'true' : 'false'
        _p['tag'] = proxy.tag
        const res = [] as string[]
        Object.keys(_p).map((k) => {
            if (_p[k]) res.push(k + '=' + _p[k])
        })
        return res.join(', ')
    }
    return undefined
}

parsers['quantumult'] = quantumultParser
