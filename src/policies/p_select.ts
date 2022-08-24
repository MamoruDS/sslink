import * as yaml from 'js-yaml'
import { NotSupportedError } from '../constants'
import { Supported } from '../types'
import { undefinedFreeJoin } from '../utils'
import { BasePolicy, ValidPolicyItem } from './base'

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
        } else if (platform === Supported.Surge) {
            const p: string[] = []
            p.push('select')
            p.push(...proxies)
            return this.name + ' = ' + undefinedFreeJoin(p, ', ')
        } else {
            throw new NotSupportedError(platform)
        }
    }
}

export { SelectPolicy }
