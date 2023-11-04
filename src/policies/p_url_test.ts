import * as yaml from 'js-yaml'

import { Supported } from '../types'
import { optionalArgs, undefinedFreeJoin } from '../utils'
import { BasePolicy, UnsupportedProxyError, ValidPolicyItem } from './base'

class UrlTestPolicyProperties {
    url: string
    interval: number
    tolerance?: number
    timeout?: number
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
        } else if (platform === Supported.Surge) {
            const p: string[] = []
            p.push('url-test')
            p.push(...proxies)
            p.push(optionalArgs('interval', this.prop.interval))
            p.push(optionalArgs('tolerance', this.prop.tolerance))
            p.push(optionalArgs('timeout', this.prop.timeout))
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else {
            throw new UnsupportedProxyError(this, platform)
        }
    }
}

export { UrlTestPolicy }
