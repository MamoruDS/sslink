import { PolicyCtr } from './policies'
import { ProxyCtr } from './proxies'
import { RuleCtr } from './rules'

class Config {
    private _proxies: ProxyCtr
    private _policies: PolicyCtr
    private _rules: RuleCtr

    constructor() {
        this._proxies = new ProxyCtr()
        this._policies = new PolicyCtr()
        this._rules = new RuleCtr()
    }

    get proxies(): ProxyCtr {
        return this._proxies
    }

    get policies(): PolicyCtr {
        return this._policies
    }

    get rules(): RuleCtr {
        return this._rules
    }

    public toString(): string {
        return ''
    }
}

export { Config }
