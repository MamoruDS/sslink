import { NotImplementedError, NotSupportedError } from '../errors'
import { Supported } from '../types'

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

export { BaseProxy }
