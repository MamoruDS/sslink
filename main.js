function sslink() {

}

const encodeBase64 = (string) => {
    return Buffer.from(string).toString('base64')
}

const decodeBase64 = (string) => {
    return Buffer.from(string, 'base64').toString('utf8')
}

const linkGenSSStyle = (tag, ssConfig) => {
    let protocol = ssConfig.protocol
    let hostname = ssConfig.server
    let port = ssConfig.server_port
    let method = ssConfig.method
    let password = ssConfig.password
    return `${protocol}://${encodeBase64(`${method}:${password}@${hostname}:${port}`)}#${encodeURIComponent(tag)}`
}

const linkGenSSRStyle = (tag, ssConfig = {}) => {
    let protocol = ssConfig.protocol
    let hostname = ssConfig.server
    let port = ssConfig.server_port
    let method = ssConfig.method
    let password = ssConfig.password
    let plugin = ssConfig.plugin
    let obfs = ssConfig.obfs
    let obfsHost = ssConfig.obfs_host
    let group = ssConfig.group
    tag = tag ? `#${tag}` : ''

    let addon = '/?'
    if (plugin) {
        plugin = `${plugin};obfs=${obfs};obfs-host=${obfsHost}`
        addon = `${addon}&plugin=${encodeURIComponent(plugin)}`
    }
    if (group) {
        addon = `${addon}&group=${encodeBase64(group)}`
    }
    addon = addon.replace(/\/\?\&/, '/?')
    if (addon === '/?') addon = ' '

    let url = `${encodeBase64(`${method}:${password}`)}@${hostname}:${port}${addon}${encodeURI(tag)}`
    return `${protocol}://${url}`
}

const ymlStyle = (tag, ssConfig = {}) => {

}

const linkGenStyle = {
    ssStyle: linkGenSSStyle,
    ssrStyle: linkGenSSRStyle,
    ymlStyle: ymlStyle
}

sslink.genSSLink = (tag, ssConfig, mode = 'ssrStyle') => {
    if (!ssConfig) return
    return linkGenStyle[mode](tag, ssConfig)
}

sslink.parseSSLink = (linkStr) => {
    let ssConfig = {
        hostname: '',
        port: '',
        method: '',
        password: '',
        protocol: '',
        tag: ''
    }
    if (linkStr.search(/^ss[r]?\:\/\//) !== -1) {
        if (linkStr.search(/(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\:/) !== -1) {
            console.log('found')
            // let content = decodeBase64('eGNoYWNoYTIwLWlldGYtcG9seTEzMDU6cGFzc3dkQDAuMC4wLjA6ODQ0Mw==')
            // console.log(content)
        } else {
            linkStr.replace(/^(ss[r]?)\:\/\/(.*?)#(.*?)$/, (sBody, sProtocol, sSsConfig, sTag) => {
                ssConfig.protocol = sProtocol
                ssConfig.tag = sTag
                sSsConfig = decodeBase64(sSsConfig)
                sSsConfig.replace(/^(.*?):(.*?)@(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\:(.*?)$/, (body, method, password, d, e, f, port) => {
                    ssConfig.method = method
                    ssConfig.password = password
                    ssConfig.port = port
                    body.replace(/(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/, (ip) => {
                        ssConfig.hostname = ip
                    })
                })
            })
        }
    } else {}
    return ssConfig
}

module.exports = sslink