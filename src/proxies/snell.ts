import * as yaml from 'js-yaml'
import { Supported } from '../types'
import { optionalArgs as oa, undefinedFreeJoin } from '../utils'
import { BaseProxy, UnsupportedProxyError } from './base'

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
            const p = {} as Record<
                string,
                string | number | Record<string, string>
            >
            p['name'] = this.prop.tag
            p['type'] = 'snell'
            p['server'] = this.prop.server
            p['port'] = this.prop.port
            p['psk'] = this.prop.psk
            if (typeof this.prop.version != undefined) {
                if (this.prop.version > 3) {
                    throw new UnsupportedProxyError(
                        this,
                        platform,
                        'version > 3'
                    )
                }
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
            throw new UnsupportedProxyError(this, platform)
        } else if (platform === Supported.Loon) {
            throw new UnsupportedProxyError(this, platform)
        } else if (platform === Supported.Stash) {
            // ref: https://lancellc.gitbook.io/clash/clash-config-file/proxies/config-a-snell-proxy
            try {
                return this.parse(Supported.Clash)
            } catch (error) {
                if (error instanceof UnsupportedProxyError) {
                    throw new UnsupportedProxyError(
                        error.proxy,
                        platform,
                        error.desc
                    )
                } else {
                    throw error
                }
            }
        } else {
            throw new UnsupportedProxyError(this, platform)
        }
    }
}

export { SnellProxy }
