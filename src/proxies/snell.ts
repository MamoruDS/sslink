import * as yaml from 'js-yaml'
import { NotSupportedError } from '../constants'
import { Supported } from '../types'
import { optionalArgs as oa, undefinedFreeJoin } from '../utils'
import { BaseProxy } from './base'

type SnellServerVersion = 1 | 2 | 3

type SnellProperties = {
    psk: string
    version?: SnellServerVersion
    mode: 'http' | 'tls'
    host?: string
    fast_open: boolean
}

class SnellProxy extends BaseProxy<SnellProperties> {
    public parse(platform: Supported): string {
        if (platform === Supported.Clash) {
            // ref: https://lancellc.gitbook.io/clash/clash-config-file/proxies/config-a-snell-proxy
            const p: Record<
                string,
                | string
                | number
                | {
                      [key in string]: string
                  }
            > = {}
            p['name'] = this.prop.tag
            p['type'] = 'snell'
            p['server'] = this.prop.server
            p['port'] = this.prop.port
            p['psk'] = this.prop.psk
            if (typeof this.prop.version != undefined) {
                p['version'] = this.prop.version
            }
            if (this.prop.mode) {
                p['obfs-opts'] = {
                    mode: this.prop.mode,
                    host: this.prop.host,
                }
            }
            return yaml.dump([p])
        } else if (platform === Supported.Surge) {
            // ref: https://manual.nssurge.com/policy/proxy.html
            const p: (string | number)[] = []
            p.push('snell')
            p.push(this.prop.server)
            p.push(this.prop.port)
            p.push(oa('psk', this.prop.psk))
            p.push(oa('obfs', this.prop.mode))
            p.push(oa('obfs-host', this.prop.host))
            p.push(oa('version', this.prop.version))
            p.push(oa('tfo', this.prop.fast_open))
            return this.prop.tag + ' = ' + undefinedFreeJoin(p, ', ')
        } else if (platform === Supported.QuantumultX) {
            return '' // TODO:
        } else {
            throw new NotSupportedError(platform)
        }
    }
}

export { SnellProxy }
