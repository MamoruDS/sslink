import * as yaml from 'js-yaml'

import { Supported } from '../types'
import { optionalArgs as oa, undefinedFreeJoin } from '../utils'
import { BasePolicy, UnsupportedProxyError, ValidPolicyItem } from './base'

class FallbackPolicyProperties {
    url: string
    interval: number
    timeout?: number
    hidden?: boolean // +surfboard
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
        } else if (platform === Supported.Loon) {
            // ref: https://loon0x00.github.io/LoonManual/#/cn/policygroup?id=fallback
            const p: string[] = []
            p.push('fallback')
            p.push(...proxies)
            p.push(oa('url', this.prop.url))
            p.push(oa('interval', this.prop.interval))
            p.push(oa('max-timeout', this.prop.timeout))
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else if (platform === Supported.Stash) {
            // ref: https://stash.wiki/en/proxy-protocols/proxy-groups#fallback
            const p = {
                name: this.name,
                type: 'fallback',
                proxies,
            }
            return yaml.dump([p])
        } else if (platform === Supported.Surge) {
            // ref: https://manual.nssurge.com/policy/group.html#fallback-group
            const p: string[] = []
            p.push('fallback')
            p.push(...proxies)
            p.push(oa('interval', this.prop.interval))
            p.push(oa('timeout', this.prop.timeout))
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else if (platform === Supported.Surfboard) {
            // ref: https://getsurfboard.com/docs/profile-format/proxygroup/fallback
            const p: string[] = []
            p.push('fallback')
            p.push(...proxies)
            p.push(oa('url', this.prop.url))
            p.push(oa('interval', this.prop.interval))
            p.push(oa('timeout', this.prop.timeout))
            p.push(oa('hidden', this.prop.hidden ? 'true' : undefined))
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else {
            throw new UnsupportedProxyError(this, platform)
        }
    }
}

export { FallbackPolicy }
