import { SSProxyCtor, SSProxy, TrojanProxyCtor, TrojanProxy } from './main'
import * as yaml from 'yaml'

export type ClashRule = {
    type:
        | 'DOMAIN-SUFFIX'
        | 'DOMAIN-KEYWORD'
        | 'DOMAIN'
        | 'IP-CIDR'
        | 'SRC-IP-CIDR'
        | 'GEOIP'
        | 'DST-PORT'
        | 'SRC-PORT'
        | 'FINAL'
    value: string | number | undefined
    policy: 'REJECT' | 'DIRECT' | string
}

export type ClashRuleA = [
    (
        | 'DOMAIN-SUFFIX'
        | 'DOMAIN-KEYWORD'
        | 'DOMAIN'
        | 'IP-CIDR'
        | 'SRC-IP-CIDR'
        | 'GEOIP'
        | 'DST-PORT'
        | 'SRC-PORT'
        | 'FINAL'
    ),
    string | number,
    'REJECT' | 'DIRECT' | string
]

export type ClashPolicy = {
    name: string
    type: 'url-test' | 'fallback' | 'select'
    proxies: string[]
    url?: string // only for url-test & fallback types
    interval?: number // only for url-test & fallback types
}

export class ClashConf {
    private _proxies: (SSProxy | TrojanProxy)[]
    private _rules: ClashRuleA[]
    private _policies: ClashPolicy[]

    constructor() {
        this._proxies = []
        this._rules = []
        this._policies = []
    }

    add(type: 'ss', ...P: ConstructorParameters<SSProxyCtor>): SSProxy
    add(
        type: 'trojan',
        ...P: ConstructorParameters<TrojanProxyCtor>
    ): TrojanProxy
    add(
        type: 'ss' | 'trojan',
        ...P:
            | ConstructorParameters<SSProxyCtor>
            | ConstructorParameters<TrojanProxyCtor>
    ): SSProxy | TrojanProxy {
        if (type == 'ss') {
            const _p = [...P] as ConstructorParameters<SSProxyCtor>
            return new SSProxy(..._p)
        }
        if (type == 'trojan') {
            const _p = [...P] as ConstructorParameters<TrojanProxyCtor>
            return new TrojanProxy(..._p)
        }
        return undefined
    }
    addProxyItem(item: SSProxy | TrojanProxy): void {
        this._proxies.push(item)
    }
    addRules(rules: ClashRuleA[]): void {
        this._rules = [...this._rules, ...rules]
    }
    addPolicy(
        name: string,
        type: ClashPolicy['type'],
        url?: string,
        interval?: number
    ): void {
        const _p = {} as ClashPolicy
        _p.name = name
        _p.type = type
        if (type == 'fallback' || type == 'url-test') {
            _p.url = url || 'www.google.com'
            _p.interval = interval || 300
        }
        _p.proxies = []
        this._policies.push(_p)
    }
    addPolicyItem(policy: string, name: string): void {
        if (policy == name) {
            throw new RangeError()
        }
        if (!this._hasPolicy(policy)) {
            throw new RangeError(`Policy:${policy} not found`)
        }
        if (!this._hasPolicy(name) && !this._hasProxy(name)) {
            throw new RangeError(`target:${name} not found`)
        } else {
            for (const _p of this._policies) {
                if (_p.name == policy) {
                    _p.proxies.push(name)
                    return
                }
            }
        }
    }
    out(): string {
        const _conf = {
            port: 7890,
            'socks-port': 7891,
            'allow-lan': true,

            mode: 'Rule',
            'log-level': 'info',
            'external-controller': '127.0.0.1:9090',
            secret: '',
            experimental: {
                'ignore-resolve-fail': true,
            },

            'cfw-bypass': [
                'localhost',
                '127.*',
                '10.*',
                '172.16.*',
                '172.17.*',
                '172.18.*',
                '172.19.*',
                '172.20.*',
                '172.21.*',
                '172.22.*',
                '172.23.*',
                '172.24.*',
                '172.25.*',
                '172.26.*',
                '172.27.*',
                '172.28.*',
                '172.29.*',
                '172.30.*',
                '172.31.*',
                '192.168.*',
                '<local>',
            ],
            'cfw-latency-timeout': 3000,
            Proxy: [],
            'Proxy Group': [],
            Rule: [],
        }
        for (const _p of this._proxies) {
            _conf.Proxy.push(_p.parse('clash', { '2obj': true }))
        }
        for (const _r of this._rules) {
            _conf.Rule.push(_r.filter((v) => v != undefined).join(', '))
        }
        for (const _p of this._policies) {
            _conf['Proxy Group'].push(_p)
        }
        return yaml.stringify(_conf)
    }
    private _hasProxy = (tag: string): boolean => {
        return this._proxies.filter((p) => p.tag == tag).length != 0
    }
    private _hasPolicy = (name: string): boolean => {
        return this._policies.filter((p) => p.name == name).length != 0
    }
}

export const preset = (): ClashConf => {
    const _c = new ClashConf()
    _c.addPolicy('auto', 'url-test', 'www.google.com', 300)
    _c.addRules([
        ['IP-CIDR', '10.0.0.0/8', 'DIRECT'],
        ['IP-CIDR', '127.0.0.0/8', 'DIRECT'],
        ['IP-CIDR', '172.16.0.0/12', 'DIRECT'],
        ['IP-CIDR', '192.168.0.0/16', 'DIRECT'],
        ['IP-CIDR', '224.0.0.0/24', 'DIRECT'],
        ['GEOIP', 'CN', 'DIRECT'],
        ['FINAL', undefined, 'auto'],
    ])
    return _c
}