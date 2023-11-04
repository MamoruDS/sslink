import * as yaml from 'js-yaml'

import { Supported } from '../types'
import { undefinedFreeJoin } from '../utils'
import { BasePolicy, UnsupportedProxyError, ValidPolicyItem } from './base'

class SelectPolicy extends BasePolicy {
    // public selected?: string

    constructor(name: string, items: ValidPolicyItem[] = []) {
        super(name, items)
    }

    public parse(platform: Supported): string {
        const proxies: string[] = this._parseItems(platform)
        if (platform === Supported.Clash) {
            const p = {
                name: this.name,
                type: 'select',
                proxies,
            }
            return yaml.dump([p])
        } else if (platform === Supported.Loon) {
            // ref: https://loon0x00.github.io/LoonManual/#/cn/policygroup?id=select-%e7%ad%96%e7%95%a5%e7%bb%84
            return this.parse(Supported.Surge)
        } else if (platform === Supported.Stash) {
            // ref: https://stash.wiki/en/proxy-protocols/proxy-groups#select
            const p = {
                name: this.name,
                type: 'select',
                proxies,
            }
            return yaml.dump([p])
        } else if (platform === Supported.Surge) {
            // ref: https://manual.nssurge.com/policy/group.html#manual-selection-group
            const p: string[] = []
            p.push('select')
            p.push(...proxies)
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else if (platform === Supported.Surfboard) {
            // ref: https://getsurfboard.com/docs/profile-format/proxygroup/select
            return this.parse(Supported.Surge)
        } else {
            throw new UnsupportedProxyError(this, platform)
        }
    }
}

export { SelectPolicy }
