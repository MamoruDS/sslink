const sslink = require('./main')

// sslink.parseSSLink('ss://eGNoYWNoYTIwLWlldGYtcG9seTEzMDU6cGFzc3dk@0.0.0.0:8443/?plugin=obfs-local%3Bobfs%3Dtls%3Bobfs-host%3Dgithub.com&group=R1JPVVAgTkFNRQ==#sample-server')

const sampleConf = {
    protocol: 'ss',
    server: '1.2.3.4',
    server_port: 8443,
    method: 'xchacha20-ietf-poly1305',
    password: 'passwd',
    plugin: 'obfs',
    obfs: 'tls',
    obfs_host: 'bing.com',
    group: 'MamoruDEV-EN',
}

const preview = conf => {
    previewArray = [
        'ssStyle',
        'ssrStyle',
        'clashStyle',
        'surge2Style',
        'surge3Style',
    ]
    for (let style of previewArray) {
        console.log(`## ${style}:`)
        console.log(sslink.genSSLink('ServerTag', conf, style) + '\n')
    }
}

preview(sampleConf)

// let proxySet = []
// proxySet.push(sampleConf)
// let sss = sslink.subscription(proxySet)
// console.log(sss)
