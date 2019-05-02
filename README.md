# sslink
## install
```shell
npm i sslink
```
## how-to-use
```node
import * as sslink from 'sslink'

const sampleConf = {
    protocol: 'ss',
    server: '1.2.3.4',
    server_port: 8443,
    method: 'xchacha20-ietf-poly1305',
    password: 'passwd',
    plugin: 'obfs',
    obfs: 'tls',
    obfs_host: 'bing.com',
    group: 'group1',
}

sslink.genSSLink('sample-server', sampleConf, 'ssStyle')
// ss://eGNoYWNoYTIwLWlldGYtcG9seTEzMDU6cGFzc3dkQDEuMi4zLjQ6ODQ0Mw==#sample-server

sslink.genSSLink('sample-server', sampleConf, 'ssrStyle')
// ss://eGNoYWNoYTIwLWlldGYtcG9seTEzMDU6cGFzc3dk@1.2.3.4:8443/?plugin=obfs%3Bobfs%3Dtls%3Bobfs-host%3Dbing.com&group=Z3JvdXAx#sample-server

sslink.genSSLink('sample-server', sampleConf, 'clashStyle')
// - name: sample-server
//   type: ss
//   server: 1.2.3.4
//   type: 8443
//   cipher: xchacha20-ietf-poly1305
//   password: passwd
//   mode: tls
//   host: bing.com

sslink.genSSLink('sample-server', sampleConf, 'surge2Style')
// sample-server = custom, 1.2.3.4, 8443, xchacha20-ietf-poly1305, passwd, https://github.com/MamoruDS/SSEncrypt/raw/master/SSEncrypt.module, obfs=tls, obfs-host=bing.com

sslink.genSSLink('sample-server', sampleConf, 'surge3Style')
// sample-server = ss, 1.2.3.4, 8443, encrypt-method=xchacha20-ietf-poly1305, password=passwd, obfs=tls, obfs-host=bing.com
```

## License
MIT © MamoruDS