import { NotSupportedError } from '../errors'
import { TextPack } from '../textpack'
import { Supported } from '../types'
import { CTR, ParseFlags } from '../utils'
import {
    parse_valid_policy_item,
    BasePolicy,
    SpecialProxy,
    ValidPolicyItem,
} from './base'

class PolicyCtr<T extends BasePolicy = BasePolicy> extends CTR<T> {
    public add(policy: T): void {
        this.push(policy)
    }

    public get(name: string): T | undefined {
        for (const policy of this._items) {
            if (policy.name === name) {
                return policy
            }
        }
    }

    public stringify(platform: Supported, parseFlags: ParseFlags): TextPack {
        const policies = this._stringify(platform, parseFlags).join('\n')
        if (platform === Supported.Clash) {
            return new TextPack(policies, {
                localTitle: 'proxy-groups:',
            })
        } else if (platform === Supported.Loon) {
            return new TextPack(policies, {
                localTitle: '[Proxy Group]',
            })
        } else if (platform === Supported.QuantumultX) {
            return new TextPack(policies, {
                localTitle: '[policy]',
            })
        } else if (platform === Supported.Stash) {
            return new TextPack(policies, {
                localTitle: 'proxy-groups:',
            })
        } else if (platform === Supported.Surfboard) {
            return new TextPack(policies, {
                localTitle: '[Proxy Group]',
            })
        } else if (platform === Supported.Surge) {
            return new TextPack(policies, {
                localTitle: '[Proxy Group]',
            })
        } else {
            return new TextPack(policies)
        }
    }
}

export { FallbackPolicy } from './p_fallback'
export { LoadBalancePolicy } from './p_loadbalance'
export { SelectPolicy } from './p_select'
export { UrlTestPolicy } from './p_url_test'

export {
    parse_valid_policy_item,
    BasePolicy,
    PolicyCtr,
    SpecialProxy,
    ValidPolicyItem,
}
