function sslink() {

}

const encodeBase64 = (string) => {
    return Buffer.from(string).toString('base64')
}

const linkGenSSStyle = (tag, ssConfig) => {
    let protocol = ssConfig.protocol
    let hostname = ssConfig.server
    let port = ssConfig.server_port
    let method = ssConfig.method
    let password = ssConfig.password
    return `ss://${encodeBase64(`${method}:${password}@${hostname}:${port}`)}#${encodeURIComponent(tag)}`
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
    return `ss://${url}`
}

const linkGenStyle = {
    ssStyle: linkGenSSStyle,
    ssrStyle: linkGenSSRStyle
}

sslink.genSSLink = (tag, ssConfig, mode = 'ssrStyle') => {
    if (!ssConfig) return
    return linkGenStyle[mode](tag, ssConfig)
}

sslink.parseSSLink = () => {

}

module.exports = sslink