import * as yaml from 'yaml'
import { SnellProxy } from './snell'
import { SSProxy } from './ss'
import { TrojanProxy } from './trojan'

export const clashParser = (
    proxy: SnellProxy | SSProxy | TrojanProxy,
    options: object = {}
): string | object => {
    if (proxy instanceof TrojanProxy) {
        const _p = {} as {
            [key in string]: string | number
        }
        _p['name'] = proxy.tag
        _p['type'] = 'trojan'
        _p['server'] = proxy.server
        _p['port'] = proxy.port
        _p['password'] = proxy.password
        return options['2obj']
            ? _p
            : options['2json']
            ? JSON.stringify(_p)
            : yaml.stringify([_p])
    }
    if (proxy instanceof SSProxy) {
        const _p = {} as {
            [key in string]:
                | string
                | number
                | {
                      [key in string]: string
                  }
        }
        _p['name'] = proxy.tag
        _p['type'] = 'ss'
        _p['server'] = proxy.server
        _p['port'] = proxy.port
        _p['cipher'] = proxy.method
        _p['password'] = proxy.password
        if (proxy.obfs.type) {
            _p['plugin'] = 'obfs'
            _p['plugin-opts'] = {
                mode: proxy.obfs.type,
                host: proxy.obfs.host,
            }
        }
        // do not support v2ray for now
        return options['2obj']
            ? _p
            : options['2json']
            ? JSON.stringify(_p)
            : yaml.stringify([_p])
    }
    if (proxy instanceof SnellProxy) {
        const _p = {} as {
            [key in string]:
                | string
                | number
                | {
                      [key in string]: string
                  }
        }
        _p['name'] = proxy.tag
        _p['type'] = 'snell'
        _p['server'] = proxy.server
        _p['port'] = proxy.port
        _p['psk'] = proxy.psk
        if (proxy.obfsMode) {
            _p['obfs-opts'] = {
                mode: proxy.obfsMode,
                host: proxy.obfsHost,
            }
        }
        return options['2obj']
            ? _p
            : options['2json']
            ? JSON.stringify(_p)
            : yaml.stringify([_p])
    }
    return undefined
}

export const quantumultParser = (proxy: SSProxy | TrojanProxy): string => {
    if (proxy instanceof SSProxy) {
        const _p = {} as {
            [key in string]: string
        }
        _p['shadowsocks'] = proxy.server + ':' + proxy.port
        _p['method'] = proxy.method
        _p['password'] = proxy.password
        if (proxy.obfs.type) {
            _p['obfs'] = proxy.obfs.type
            _p['obfs-host'] = proxy.obfs.host
            _p['obfs-uri'] =
                proxy.obfs.type == 'http' ? '/resource/file' : undefined
        } else if (proxy.v2ray.type) {
            _p['obfs'] = proxy.v2ray.tls ? 'wss' : 'ws'
            _p['obfs-host'] = proxy.v2ray.host
            _p['obfs-uri'] = proxy.v2ray.tls ? '/ws' : undefined
            _p['tls13'] = proxy.v2ray.tls13 ? 'true' : undefined
        }
        _p['fast-open'] = proxy.fastOpen ? 'true' : 'false'
        _p['udp-relay'] = proxy.udpRelay ? 'true' : 'false'
        _p['tag'] = proxy.tag
        const res = [] as string[]
        Object.keys(_p).map((k) => {
            if (_p[k]) res.push(k + '=' + _p[k])
        })
        return res.join(', ')
    }
    if (proxy instanceof TrojanProxy) {
        const _p = {} as {
            [key in string]: string
        }
        _p['trojan'] = proxy.server + ':' + proxy.port
        _p['password'] = proxy.password
        _p['over-tls'] = proxy.tls ? 'true' : 'false'
        _p['tls-verification'] = proxy.certVerify ? 'true' : 'false'
        _p['tls13'] = proxy.tls13 ? 'true' : undefined
        _p['fast-open'] = proxy.fastOpen ? 'true' : 'false'
        _p['udp-relay'] = proxy.udpRelay ? 'true' : 'false'
        _p['tag'] = proxy.tag
        const res = [] as string[]
        Object.keys(_p).map((k) => {
            if (_p[k]) res.push(k + '=' + _p[k])
        })
        return res.join(', ')
    }
    return undefined
}
