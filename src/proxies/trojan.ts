import * as yaml from 'js-yaml'
import { NotSupportedError } from '../constants'
import { Supported } from '../types'
import { optionalArgs as oa, undefinedFreeJoin } from '../utils'
import { BaseProxy } from './base'

type TrojanProperties = {
    username?: string
    password?: string
    tls?: string
    certVerify: boolean
    tls13: boolean
    fast_open: boolean
    udp_relay: boolean
}

class TrojanProxy extends BaseProxy<TrojanProperties> {
    public parse(platform: Supported): string | undefined {
        if (platform === Supported.Clash) {
            const p = {} as Record<string, string | number>
            p['name'] = this.prop.tag
            p['type'] = 'trojan'
            p['server'] = this.prop.server
            p['port'] = this.prop.port
            p['password'] = this.prop.password
            return yaml.dump([p])
        } else if (platform === Supported.Surge) {
            const p: (string | number)[] = []
            p.push('trojan')
            p.push(this.prop.server)
            p.push(this.prop.port)
            p.push(oa('password', this.prop.password)) // TODO:
            p.push(oa('udp-relay', this.prop.udp_relay))
            p.push(oa('skip-cert-verify', this.prop.certVerify))
            p.push(oa('tfo', this.prop.fast_open))
            return this.prop.tag + ' = ' + undefinedFreeJoin(p, ', ')
        } else if (platform === Supported.QuantumultX) {
            const p = {} as Record<string, string | number | boolean | null>
            p['trojan'] = this.prop.server + ':' + this.prop.port
            p['password'] = this.prop.password ?? null
            p['over-tls'] = this.prop.tls || null
            p['tls-verification'] = this.prop.certVerify
            p['tls13'] = this.prop.tls13
            p['fast-open'] = this.prop.fast_open
            p['udp-relay'] = this.prop.udp_relay
            p['tag'] = this.prop.tag
            return undefinedFreeJoin(
                Object.keys(p).map((key) => {
                    if (p[key] !== null) return key + '=' + p[key]
                }),
                ', '
            )
        } else {
            throw new NotSupportedError(platform)
        }
    }
}

export { TrojanProxy }
