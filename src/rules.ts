import {
    NotSupportedError,
    RULE_SUPPORT_MAP_CLASH,
    RULE_SUPPORT_MAP_SURGE,
} from './constants'
import { parse_valid_policy_item, ValidPolicyItem } from './policies'
import {
    CountryCode,
    IP_Based_Rules,
    Port_Based_Rules,
    RuleType,
    Supported,
} from './types'
import { undefinedFreeJoin } from './utils'

type IP_Based_Options = {
    no_resolve?: boolean
}

type RuleProp = {
    value?: any
    proxy?: ValidPolicyItem
    options?: Record<string, any>
    comment?: string
}

class Rule {
    public type: RuleType
    public properties: RuleProp

    constructor(type: RuleType, prop: RuleProp) {
        this.type = type
        this.properties = prop
    }

    get prop(): RuleProp {
        return this.properties
    }

    public parse(platform: Supported): string | undefined {
        let proxy = undefined
        if (typeof this.prop.proxy != 'undefined') {
            proxy = parse_valid_policy_item(this.prop.proxy, platform)
        }
        const options = []
        if (typeof this.prop.options != 'undefined') {
            if (this.prop.options?.no_resolve ?? false) {
                options.push('no-resolve')
            }
        } // TODO:
        if (platform === Supported.Clash) {
            if (this.type === RuleType.COMMENT) {
                return
            } else {
                const rule = RULE_SUPPORT_MAP_CLASH[this.type]
                return undefinedFreeJoin(
                    [rule, this.prop.value, proxy, ...options],
                    ', '
                )
            }
        } else if (platform === Supported.Surge) {
            if (this.type === RuleType.COMMENT) {
                return '# ' + this.prop.comment
            } else {
                const rule = RULE_SUPPORT_MAP_SURGE[this.type]
                return (
                    undefinedFreeJoin(
                        [rule, this.prop.value, proxy, ...options],
                        ','
                    ) +
                    (typeof this.prop.comment == 'string'
                        ? ` // ${this.prop.comment}`
                        : '')
                )
            }
        } else {
            throw new NotSupportedError(platform)
        }
    }
}

class RuleCtr {
    private _rules: Rule[]

    constructor() {
        this._rules = []
    }

    add(
        ruleType: IP_Based_Rules,
        value: CountryCode,
        proxy: ValidPolicyItem,
        options: IP_Based_Options,
        comment?: string
    ): Rule
    add(ruleType: RuleType.FINAL, proxy: ValidPolicyItem): Rule
    add(
        ruleType: RuleType.GEOIP,
        value: CountryCode,
        proxy: ValidPolicyItem,
        options?: IP_Based_Options,
        comment?: string
    ): Rule
    add(ruleType: RuleType.COMMENT, comment: string): Rule
    add(
        ruleType: Port_Based_Rules,
        value: number,
        proxy: ValidPolicyItem,
        comment?: string
    ): Rule
    add(
        ruleType: RuleType.DEST_PORT | RuleType.SRC_PORT,
        value: string,
        proxy: ValidPolicyItem,
        comment?: string
    ): Rule
    add(...args: any[]): Rule {
        const ruleType = args[0]
        const prop: RuleProp = {}

        if (ruleType === RuleType.FINAL) {
            prop['proxy'] = args[1]
        } else if (
            ruleType === RuleType.GEOIP ||
            ruleType === RuleType.IP_CIDR ||
            ruleType === RuleType.IP_CIDR_6
        ) {
            prop['value'] = args[1]
            prop['proxy'] = args[2]
            prop['options'] = args[3]
            prop['comment'] = args[4]
        } else if (ruleType === RuleType.COMMENT) {
            prop['comment'] = args[1]
        } else {
            prop['value'] = args[1]
            prop['proxy'] = args[2]
            prop['comment'] = args[3]
        }

        const rule = new Rule(ruleType, prop)
        this._rules.push(rule)
        return rule
    }

    public stringify(platform: Supported): string {
        const rules = this._rules.map((rule) => rule.parse(platform))
        return undefinedFreeJoin(rules, '\n')
    }
}

export { RuleCtr }
