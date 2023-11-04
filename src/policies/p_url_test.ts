import * as yaml from 'js-yaml'

import { Supported } from '../types'
import { optionalArgs as oa, undefinedFreeJoin } from '../utils'
import { BasePolicy, UnsupportedProxyError, ValidPolicyItem } from './base'

class UrlTestPolicyProperties {
    url: string
    interval: number
    tolerance?: number
    timeout?: number
    hidden?: boolean // +surfboard
}

class UrlTestPolicy extends BasePolicy {
    public properties: UrlTestPolicyProperties

    constructor(
        name: string,
        properties: UrlTestPolicyProperties,
        items: ValidPolicyItem[] = []
    ) {
        super(name, items)
        this.properties = properties
    }

    get prop(): UrlTestPolicyProperties {
        return this.properties
    }

    public parse(platform: Supported): string {
        const proxies: string[] = this._parseItems(platform)
        if (platform === Supported.Clash) {
            const p = {
                name: this.name,
                type: 'url-test',
                url: this.prop.url,
                interval: this.prop.interval,
                proxies,
            }
            return yaml.dump([p])
        } else if (platform === Supported.Loon) {
            // ref: https://loon0x00.github.io/LoonManual/#/cn/policygroup?id=url-test-%e7%ad%96%e7%95%a5%e7%bb%84
            const p: string[] = []
            p.push('url-test')
            p.push(...proxies)
            p.push(oa('url', this.prop.url))
            p.push(oa('interval', this.prop.interval))
            p.push(oa('tolerance', this.prop.tolerance))
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else if (platform === Supported.Stash) {
            // ref: https://stash.wiki/en/proxy-protocols/proxy-groups#url-test
            const p = {
                name: this.name,
                type: 'url-test',
                proxies,
                interval: this.prop.interval,
            }
            return yaml.dump([p])
        } else if (platform === Supported.Surge) {
            // ref https://manual.nssurge.com/policy/group.html#automatic-testing-group
            const p: string[] = []
            p.push('url-test')
            p.push(...proxies)
            p.push(oa('interval', this.prop.interval))
            p.push(oa('tolerance', this.prop.tolerance))
            p.push(oa('timeout', this.prop.timeout))
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else if (platform === Supported.Surfboard) {
            // ref: https://getsurfboard.com/docs/profile-format/proxygroup/auto
            const p: string[] = []
            p.push('url-test')
            p.push(...proxies)
            p.push(oa('url', this.prop.url))
            p.push(oa('interval', this.prop.interval))
            p.push(oa('tolerance', this.prop.tolerance))
            p.push(oa('timeout', this.prop.timeout))
            p.push(oa('hidden', this.prop.hidden ? 'true' : undefined))
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else {
            throw new UnsupportedProxyError(this, platform)
        }
    }
}

export { UrlTestPolicy }
