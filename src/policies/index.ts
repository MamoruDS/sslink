import { Supported } from '../types'
import {
    parse_valid_policy_item,
    BasePolicy,
    SpecialProxy,
    ValidPolicyItem,
} from './base'

class PolicyCtr {
    private _policies: BasePolicy[]

    constructor() {
        this._policies = []
    }

    public add(policy: BasePolicy): void {
        this._policies.push(policy)
    }

    public stringify(platform: Supported): string {
        return this._policies.map((policy) => policy.parse(platform)).join('\n')
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
