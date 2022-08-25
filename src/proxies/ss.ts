import * as yaml from 'js-yaml'
import { NotSupportedError } from '../constants'
import { Supported } from '../types'
import { optionalArgs as oa, undefinedFreeJoin } from '../utils'
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
            if (typeof this.prop.obfs_plugin.type !== 'undefined') {
                p['plugin'] = 'obfs'
                p['plugin-opts'] = {
                    mode: this.prop.obfs_plugin.type,
                    host: this.prop.obfs_plugin.host,
                }
            }
            // do not support v2ray for now
            return yaml.dump([p])
        } else if (platform === Supported.Surge) {
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
        } else {
            throw new NotSupportedError(platform)
        }
    }
}

export { SSProxy }
