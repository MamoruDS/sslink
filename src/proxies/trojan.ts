import * as yaml from 'js-yaml'
import { NotSupportedError } from '../constants'
import { RecStr, Supported } from '../types'
import { isUndef, optionalArgs as oa, undefinedFreeJoin } from '../utils'
import { BaseProxy } from './base'

type WebsocketConfig = {
    path?: string
    headers?: RecStr<string>
}

// ref: https://trojan-gfw.github.io/trojan/config
type TrojanProperties = {
    username?: string
    password?: string
    tls?: boolean
    certVerify: boolean
    tls13?: boolean
    sni?: string
    fastOpen: boolean
    udpRelay: boolean
    websocket?: WebsocketConfig
    alpn?: string[] // ['h2', 'http/1.1']
}

class TrojanProxy extends BaseProxy<TrojanProperties> {
    public parse(platform: Supported): string | undefined {
        const WS = !isUndef(this.prop.websocket)
        if (platform === Supported.Clash) {
            // ref: https://lancellc.gitbook.io/clash/clash-config-file/proxies/config-a-torjan-proxy
            const p = {} as RecStr<any | undefined>
            p['name'] = this.prop.tag
            p['type'] = 'trojan'
            p['server'] = this.prop.server
            p['port'] = this.prop.port
            p['password'] = this.prop.password
            p['network'] = WS ? 'ws' : undefined
            p['skip-cert-verify'] = !this.prop.certVerify || undefined
            p['sni'] = this.prop.sni || undefined
            p['alpn'] = this.prop.alpn || undefined
            p['udp'] = this.prop.udpRelay || undefined
            p['ws-opts'] = this.prop.websocket
            return yaml.dump([p])
        } else if (platform === Supported.Surge) {
            // ref: https://manual.nssurge.com/policy/proxy.html
            const p: (string | number)[] = []
            p.push('trojan')
            p.push(this.prop.server)
            p.push(this.prop.port)
            p.push(oa('password', this.prop.password))
            p.push(oa('skip-cert-verify', !this.prop.certVerify || undefined))
            p.push(oa('sni', this.prop.sni))
            if (WS) {
                p.push(oa('ws', true))
                p.push(oa('ws-path', this.prop.websocket.path))
                p.push(
                    oa(
                        'ws-headers',
                        Object.keys(this.prop.websocket?.headers ?? {})
                            .map((key) => {
                                return `${key}:"${this.prop.websocket.headers[key]}"`
                            })
                            .join('|') || undefined
                    )
                )
            }
            // p.push(oa('udp-relay', this.prop.udpRelay)) // TODO:
            p.push(oa('tfo', this.prop.fastOpen))
            return this.prop.tag + ' = ' + undefinedFreeJoin(p, ', ')
        } else if (platform === Supported.QuantumultX) {
            // ref: https://github.com/crossutility/Quantumult-X/blob/master/sample.conf#L158
            const p = {} as RecStr<string | number | boolean | null>
            p['trojan'] = this.prop.server + ':' + this.prop.port
            p['password'] = this.prop.password ?? null
            p['over-tls'] = this.prop.tls || null
            p['tls-host'] = this.prop.sni || null
            p['tls-verification'] = this.prop.certVerify
            p['tls13'] = this.prop.tls13 || null
            p['fast-open'] = this.prop.fastOpen
            p['udp-relay'] = this.prop.udpRelay
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
