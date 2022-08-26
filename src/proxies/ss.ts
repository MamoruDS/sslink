import * as yaml from 'js-yaml'
import { NotSupportedError } from '../constants'
import { Supported } from '../types'
import { isUndef, optionalArgs as oa, undefinedFreeJoin } from '../utils'
import { BaseProxy } from './base'

type SSMethods =
    | 'rc4'
    | 'rc4-md5'
    | 'aes-128-gcm'
    | 'aes-192-gcm'
    | 'aes-256-gcm'
    | 'aes-128-cfb'
    | 'aes-192-cfb'
    | 'aes-256-cfb'
    | 'aes-128-ctr'
    | 'aes-192-ctr'
    | 'aes-256-ctr'
    | 'chacha20'
    | 'chacha20-ietf'
    | 'chacha20-ietf-poly1305'
    | 'xchacha20-ietf-poly1305'

type ObfPluginTypes = 'http' | 'tls'
type V2RayPluginTypes = 'websocket' | 'http2' | 'mkcp'

type ObfsPluginOptions = {
    type: ObfPluginTypes
    host?: string
}

type V2rayPluginOptions = {
    type: V2RayPluginTypes
    host?: string
    tls?: boolean
    tls13?: boolean // quanx only
}

type SSProperties = {
    method: SSMethods
    password: string
    obfs_plugin?: ObfsPluginOptions
    v2ray_plugin?: V2rayPluginOptions
    udp_relay: boolean
    fast_open: boolean
}

class SSProxy extends BaseProxy<SSProperties> {
    public parse(platform: Supported): string | undefined {
        if (platform === Supported.Clash) {
            // ref: https://lancellc.gitbook.io/clash/clash-config-file/proxies/config-a-shadowsocks-proxy
            const p = {} as {
                [key in string]:
                    | string
                    | number
                    | {
                          [key in string]: string
                      }
            }
            p['name'] = this.prop.tag
            p['type'] = 'ss'
            p['server'] = this.prop.server
            p['port'] = this.prop.port
            p['cipher'] = this.prop.method
            p['password'] = this.prop.password
            if (!isUndef(this.prop.obfs_plugin?.type)) {
                p['plugin'] = 'obfs'
                p['plugin-opts'] = {
                    mode: this.prop.obfs_plugin.type,
                    host: this.prop.obfs_plugin.host,
                }
            }
            // do not support v2ray for now
            return yaml.dump([p])
        } else if (platform === Supported.Surge) {
            // ref: https://manual.nssurge.com/policy/proxy.html
            const p: (string | number)[] = []
            p.push('ss')
            p.push(this.prop.server)
            p.push(this.prop.port)
            p.push(oa('encrypt-method', this.prop.method))
            p.push(oa('password', this.prop.password))
            p.push(oa('obfs', this.prop.obfs_plugin?.type))
            p.push(oa('obfs-host', this.prop.obfs_plugin?.host))
            p.push(oa('udp-relay', this.prop.udp_relay ? 'true' : undefined))
            p.push(oa('tfo', this.prop.fast_open ? 'true' : undefined))
            return this.prop.tag + ' = ' + undefinedFreeJoin(p, ', ')
        } else if (platform === Supported.QuantumultX) {
            // ref: https://github.com/crossutility/Quantumult-X/blob/d30a160eb093b3be175ea5eeeff0648db50b2a20/sample.conf#L131
            const p = {} as Record<string, string | number | boolean | null>
            p['shadowsocks'] = this.prop.server + ':' + this.prop.port
            p['method'] = this.prop.method
            p['password'] = this.prop.password
            if (!isUndef(this.prop.obfs_plugin?.type)) {
                p['obfs'] = this.prop.obfs_plugin.type
                p['obfs-host'] = this.prop.obfs_plugin.host ?? null
                p['obfs-uri'] =
                    this.prop.obfs_plugin.type === 'http'
                        ? '/resource/file'
                        : null
            } else if (!isUndef(this.prop.v2ray_plugin?.type)) {
                p['obfs'] = this.prop.v2ray_plugin.tls ? 'wss' : 'ws'
                p['obfs-host'] = this.prop.v2ray_plugin.host ?? null
                p['obfs-uri'] = this.prop.v2ray_plugin.tls ? '/ws' : null
                p['tls13'] = this.prop.v2ray_plugin.tls13 || null
            }
            p['udp-relay'] = this.prop.udp_relay
            p['fast-open'] = this.prop.fast_open
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

export { SSProxy }
