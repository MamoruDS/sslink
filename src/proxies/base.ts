import { NotImplementedError, NotSupportedError } from '../errors'
import { Supported } from '../types'

class UnsupportedProxyError<T extends BaseProxy> extends NotSupportedError {
    proxy: T
    constructor(proxy: T, platform: Supported, desc?: string) {
        super(platform, desc)
        this.proxy = proxy
    }
}

type BaseProperties = {
    tag: string
    server: string
    port: number
    groups: string[]
}

class BaseProxy<P extends object = {}> {
    public readonly properties: P & BaseProperties

    constructor(properties: P & BaseProperties) {
        this.properties = properties
    }

    get prop(): P & BaseProperties {
        return this.properties
    }

    public parse(platform: Supported): string | undefined {
        throw new NotImplementedError()
    }
}

export { BaseProxy, UnsupportedProxyError }
