# sslink
## how-to-use
```node
const sslink = require('sslink')

let ss = sslink.genSSLink('sample-server', {
    server: '0.0.0.0',
    server_port: 8443,
    method: 'xchacha20-ietf-poly1305',
    password: 'passwd'
}, 'ssStyle')

console.log(ss)
// ss://eGNoYWNoYTIwLWlldGYtcG9seTEzMDU6cGFzc3dkQDAuMC4wLjA6ODQ0Mw==#sample-server

ss = sslink.genSSLink('sample-server', {
    server: '0.0.0.0',
    server_port: 8443,
    method: 'xchacha20-ietf-poly1305',
    password: 'passwd',
    plugin: 'obfs-local',
    obfs: 'tls',
    obfs_host: 'github.com',
    group: 'GROUP NAME'
}, 'ssrStyle')

console.log(ss)
// ss://eGNoYWNoYTIwLWlldGYtcG9seTEzMDU6cGFzc3dk@0.0.0.0:8443/?plugin=obfs-local%3Bobfs%3Dtls%3Bobfs-host%3Dgithub.com&group=R1JPVVAgTkFNRQ==#sample-server
```