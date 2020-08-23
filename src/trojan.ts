import { Optional, assignDefault } from './utils'
import { BaseProxy } from './proxy'

type TrojanOptions = {
    certVerify: boolean
    tls13: boolean
    fast_open: boolean
    udp_relay: boolean
}

const defaultTrojanOptions: Required<TrojanOptions> = {
    certVerify: true,
    tls13: false,
    fast_open: false,
    udp_relay: false,
}

export type TrojanProxyCtor = {
    new (
        tag: string,
        server: string,
        port: number,
        password: string,
        tls: boolean,
        options?: Optional<TrojanOptions>,
        policyGroup?: string[]
    ): TrojanProxy
}

export class TrojanProxy extends BaseProxy {
    public readonly username?: string
    public readonly password?: string
    public readonly tls?: boolean
    public readonly certVerify?: boolean
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
        options: Optional<TrojanOptions> = {},
        policyGroup: string[] = []
    ) {
        super(tag, server, port, policyGroup)
        const _options = assignDefault(defaultTrojanOptions, options)
        this.password = password
        this.tls = tls
        this.certVerify = _options.certVerify
        this.tls13 = _options.tls13
        this.fastOpen = _options.fast_open
        this.udpRelay = _options.udp_relay
    }
}
