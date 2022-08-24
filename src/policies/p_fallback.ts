import * as yaml from 'js-yaml'
import { NotSupportedError } from '../constants'
import { Supported } from '../types'
import { optionalArgs, undefinedFreeJoin } from '../utils'
import { BasePolicy, ValidPolicyItem } from './base'

class FallbackPolicyProperties {
    url: string
    interval: number
    timeout?: number
}

class FallbackPolicy extends BasePolicy {
    public properties: FallbackPolicyProperties

    constructor(
        name: string,
        properties: FallbackPolicyProperties,
        items: ValidPolicyItem[] = []
    ) {
        super(name, items)
        this.properties = properties
    }

    get prop(): FallbackPolicyProperties {
        return this.properties
    }

    public parse(platform: Supported): string {
        const proxies: string[] = this._parseItems(platform)
        if (platform === Supported.Clash) {
            const p = {
                name: this.name,
                type: 'fallback',
                url: this.prop.url,
                interval: this.prop.interval,
                proxies,
            }
            return yaml.dump([p])
        } else if (platform === Supported.Surge) {
            const p: string[] = []
            p.push('fallback')
            p.push(...proxies)
            p.push(optionalArgs('interval', this.prop.interval))
            p.push(optionalArgs('timeout', this.prop.timeout))
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else {
            throw new NotSupportedError(platform)
        }
    }
}

export { FallbackPolicy }
