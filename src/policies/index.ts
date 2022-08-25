import {  Supported } from '../types'
import { CTR } from '../utils'
import {
    parse_valid_policy_item,
    BasePolicy,
    SpecialProxy,
    ValidPolicyItem,
} from './base'

class PolicyCtr<T extends BasePolicy = BasePolicy> extends CTR<T> {
    public add(policy: T): void {
        this._items.push(policy)
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
