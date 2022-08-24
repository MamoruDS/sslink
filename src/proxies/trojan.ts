import * as yaml from 'js-yaml'
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
    parse(platform: Supported): string | undefined {
        if (platform === Supported.Clash) {
            const p = {} as {
                [key in string]: string | number
            }
            p['name'] = this.prop.tag
            p['type'] = 'trojan'
            p['server'] = this.prop.server
            p['port'] = this.prop.port
            p['password'] = this.prop.password
            return yaml.dump([p])
        }
        if (platform === Supported.Surge) {
            const p: (string | number)[] = []
            p.push('trojan')
            p.push(this.prop.server)
            p.push(this.prop.port)
            p.push(oa('password', this.prop.password))
            p.push(oa('udp-relay', this.prop.udp_relay))
            p.push(oa('skip-cert-verify', this.prop.certVerify))
            p.push(oa('tfo', this.prop.fast_open))
            return this.prop.tag + ' = ' + undefinedFreeJoin(p, ', ')
        }
        return
    }
}

export { TrojanProxy }
