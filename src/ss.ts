import { Optional, assignDefault } from './utils'
import { BaseProxy } from './proxy'

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

export type SSProxyCtor = {
    new (
        tag: string,
        server: string,
        port: number,
        method: SSMethods,
        password: string,
        options?: Optional<SSOptions>,
        policyGroup?: string[]
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
        options: Optional<SSOptions> = {},
        policyGroup: string[] = []
    ) {
        super(tag, server, port, policyGroup)
        const _options = assignDefault(defaultSSOptions, options)
        this.method = method
        this.password = password
        this.obfs = _options.obfs_plugin
        this.v2ray = _options.v2ray_plugin
        this.fastOpen = _options.fast_open
        this.udpRelay = _options.udp_relay
    }
}
