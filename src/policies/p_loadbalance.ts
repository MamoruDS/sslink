import * as yaml from 'js-yaml'

import { Supported } from '../types'
import { optionalArgs as oa, undefinedFreeJoin } from '../utils'
import { BasePolicy, UnsupportedProxyError, ValidPolicyItem } from './base'

class LoadBalancePolicyProperties {
    url?: string
    interval?: number
    timeout?: number // +loon
    persistent?: boolean // +surge; equal to stash's strategy.consistent-hashing
    algorithm?: 'Random' | 'PCC' | 'Round-Robin' // +loon
    hidden?: boolean // +surfboard
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
        } else if (platform === Supported.Loon) {
            // ref: https://loon0x00.github.io/LoonManual/#/cn/policygroup?id=load-balance
            const p: string[] = []
            p.push('load-balance')
            p.push(...proxies)
            p.push(oa('url', this.prop.url))
            p.push(oa('interval', this.prop.interval))
            p.push(oa('max-timeout', this.prop.timeout))
            p.push(
                oa(
                    'algorithm',
                    this.prop.algorithm
                        ? this.prop.algorithm
                        : this.prop.persistent
                        ? 'PCC'
                        : undefined
                )
            )
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else if (platform === Supported.Stash) {
            // ref: https://stash.wiki/en/proxy-protocols/proxy-groups#load-balance
            const p = {
                name: this.name,
                type: 'load-balance',
                strategy: this.prop.persistent
                    ? 'consistent-hashing'
                    : 'round-robin',
                proxies,
            }
            return yaml.dump([p])
        } else if (platform === Supported.Surge) {
            // ref: https://manual.nssurge.com/policy/group.html#load-balance-group
            const p: string[] = []
            p.push('load-balance')
            p.push(...proxies)
            p.push(oa('persistent', this.prop.interval ? 1 : undefined))
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else if (platform === Supported.Surfboard) {
            // ref: https://getsurfboard.com/docs/profile-format/proxygroup/load-balance
            const p: string[] = []
            p.push('load-balance')
            p.push(...proxies)
            p.push(oa('hidden', this.prop.hidden ? 'true' : undefined))
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else {
            throw new UnsupportedProxyError(this, platform)
        }
    }
}

export { LoadBalancePolicy }
