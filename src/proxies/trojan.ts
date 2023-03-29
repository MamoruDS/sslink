import * as yaml from 'js-yaml'
import { NotSupportedError } from '../constants'
import { RecStr, Supported } from '../types'
import { optionalArgs as oa, undefinedFreeJoin } from '../utils'
import { BaseProxy } from './base'

type TransportWSConfig = {
    path?: string
    headers?: RecStr<string>
}

type TransportGRPCConfig = {
    serviceName?: string
}

type Transport = 'ws' | 'grpc'

type TransportProp<T extends Transport> = T extends 'ws'
    ? { protocol: T } & TransportWSConfig
    : T extends 'grpc'
    ? { protocol: T } & TransportGRPCConfig
    : never

// ref: https://trojan-gfw.github.io/trojan/config
type TrojanProperties = {
    username?: string
    password?: string
    tls?: boolean
    certVerify: boolean
    tls13?: boolean // quanx only
    sni?: string
    fastOpen: boolean
    udpRelay: boolean
    transport?: TransportProp<Transport>
    alpn?: string[] // ['h2', 'http/1.1']
}

class TrojanProxy extends BaseProxy<TrojanProperties> {
    public parse(platform: Supported): string | undefined {
        // const WS = !isUndef(this.prop.websocket)
        if (platform === Supported.Clash) {
            // ref: https://lancellc.gitbook.io/clash/clash-config-file/proxies/config-a-torjan-proxy
            const p = {} as RecStr<any | undefined>
            p['name'] = this.prop.tag
            p['type'] = 'trojan'
            p['server'] = this.prop.server
            p['port'] = this.prop.port
            p['password'] = this.prop.password
            p['skip-cert-verify'] = !this.prop.certVerify || undefined
            p['sni'] = this.prop.sni
            p['alpn'] = this.prop.alpn
            p['udp'] = this.prop.udpRelay || undefined
            if (this.prop.transport?.protocol === 'ws') {
                p['network'] = 'ws'
                p['ws-opts'] = {
                    path: this.prop.transport.path,
                    headers: this.prop.transport.headers,
                }
            }
            if (this.prop.transport?.protocol === 'grpc') {
                p['network'] = 'grpc'
                p['grpc-opts'] = {
                    serviceName: this.prop.transport.serviceName,
                }
            }
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
            if (this.prop.transport?.protocol === 'ws') {
                p.push(oa('ws', true))
                p.push(oa('ws-path', this.prop.transport.path))
                p.push(
                    oa(
                        'ws-headers',
                        Object.entries(this.prop.transport.headers ?? {})
                            .map(([key, val]) => {
                                return `${key}:"${val}"`
                            })
                            .join('|') || undefined
                    )
                )
            }
            // p.push(oa('udp-relay', this.prop.udpRelay)) // TODO:
            p.push(oa('tfo', this.prop.fastOpen))
            return this.prop.tag + ' = ' + undefinedFreeJoin(p, ', ')
        } else if (platform === Supported.QuantumultX) {
            // ref: https://github.com/crossutility/Quantumult-X/blob/d30a160eb093b3be175ea5eeeff0648db50b2a20/sample.conf#L159
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
        } else if (platform === Supported.Loon) {
            // https://loon0x00.github.io/LoonManual/#/cn/node
            const p: (string | number)[] = []
            p.push('trojan')
            p.push(this.prop.server)
            p.push(this.prop.port)
            p.push(`"${this.prop.password ?? ''}"`)
            p.push(
                oa(
                    'alpn',
                    (this.prop.alpn ?? []).length > 0
                        ? this.prop.alpn.join(',') // TODO: separator unknown
                        : undefined
                )
            )
            p.push(oa('skip-cert-verify', !this.prop.certVerify || undefined))
            p.push(oa('tls-name', this.prop.sni))
            p.push(oa('fast-open', this.prop.fastOpen))
            p.push(oa('udp', this.prop.udpRelay))
            if (this.prop.transport?.protocol === 'ws') {
                p.push(oa('transport', 'ws'))
                p.push(oa('path', this.prop.transport.path))
                p.push(oa('host', this.prop.transport.headers?.Host))
            }
            return this.prop.tag + ' = ' + undefinedFreeJoin(p, ',')
        } else {
            throw new NotSupportedError(platform)
        }
    }
}

export { TrojanProxy }
