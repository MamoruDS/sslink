import * as yaml from 'js-yaml'
import { NotSupportedError } from '../errors'
import { Supported } from '../types'
import { optionalArgs, undefinedFreeJoin } from '../utils'
import { BasePolicy, ValidPolicyItem } from './base'

class LoadBalancePolicyProperties {
    url?: string
    interval?: number
    persistent?: boolean // surge only
}

class LoadBalancePolicy extends BasePolicy {
    public properties: LoadBalancePolicyProperties

    constructor(
        name: string,
        properties: LoadBalancePolicyProperties,
        items: ValidPolicyItem[] = []
    ) {
        super(name, items)
        this.properties = properties
    }

    get prop(): LoadBalancePolicyProperties {
        return this.properties
    }

    public parse(platform: Supported): string {
        const proxies: string[] = this._parseItems(platform)
        if (platform === Supported.Clash) {
            const p = {
                name: this.name,
                type: 'load-balance',
                url: this.prop.url,
                interval: this.prop.interval,
                proxies,
            }
            return yaml.dump([p])
        } else if (platform === Supported.Surge) {
            const p: string[] = []
            p.push('load-balance')
            p.push(...proxies)
            p.push(
                optionalArgs('persistent', this.prop.interval ? 1 : undefined)
            )
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else {
            throw new NotSupportedError(platform)
        }
    }
}

export { LoadBalancePolicy }
