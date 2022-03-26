import { Optional, assignDefault } from './utils'
import { BaseProxy } from './proxy'

type SnellServerVersion = 1 | 2 | 3

type SnellOptions = {
    version?: SnellServerVersion
    mode: 'http' | 'tls'
    host?: string
}

const defaultSnellOptions: Required<SnellOptions> = {
    version: undefined,
    mode: 'http',
    host: undefined,
}

export type SnellProxyCtor = {
    new (
        tag: string,
        server: string,
        port: number,
        psk: string,
        obfsOpts?: Optional<SnellOptions>,
        policyGroup?: string[]
    ): SnellProxy
}

export class SnellProxy extends BaseProxy {
    public readonly psk: string
    public readonly version?: SnellServerVersion
    public readonly obfsMode?: 'http' | 'tls'
    public readonly obfsHost?: string

    constructor(...P: ConstructorParameters<SnellProxyCtor>)
    constructor(
        tag: string,
        server: string,
        port: number,
        psk: string,
        options: Optional<SnellOptions> = {},
        policyGroup: string[] = []
    ) {
        super(tag, server, port, policyGroup)
        const _options = assignDefault(defaultSnellOptions, options)
        this.psk = psk
        this.version = _options.version
        this.obfsMode = _options.mode
        this.obfsHost = _options.host
    }
}
