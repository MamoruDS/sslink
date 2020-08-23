# sslink
![npm](https://img.shields.io/npm/v/sslink.svg?style=flat-square)

## Installation
```shell
npm i sslink
```
## Usage
Add your proxies first
```node
const sslink = require('sslink')

const servers = []
servers.push(
    new sslink.SSProxy(
        'random-server-1',
        'server1.address.com',
        25565,
        'xchacha20-ietf-poly1305',
        'password',
        {
            obfs_plugin: {
                type: 'http',
                host: 'www.amazon.com',
            },
            udp_relay: true,
        },
        ['GROUP-1']
    )
)

servers.push(
    new sslink.TrojanProxy(
        'random-server-2',
        'server2.address.com',
        443,
        'password',
        true,
        {
            udp_relay: true,
            fast_open: true,
        },
        ['GROUP-1']
    )
)

servers.push(
    new sslink.SSProxy(
        'random-server-3',
        'server2.address.com',
        25565,
        'chacha20-ietf-poly1305',
        'password',
        {},
        ['GROUP-2']
    )
)
```
- Generate external proxies for Quantumult
    ```node
    const proxies = []
    for (const p of servers) {
        proxies.push(p.parse('quantumult'))
    }
    console.log(proxies.join('\n'))
    ```
    output:
    ```
    shadowsocks=server1.address.com:25565, method=xchacha20-ietf-poly1305, password=password, obfs=http, obfs-host=www.amazon.com, obfs-uri=/resource/file, fast-open=false, udp-relay=true, tag=random-server-1
    trojan=server2.address.com:443, password=password, over-tls=true, tls-verification=true, fast-open=true, udp-relay=true, tag=random-server-2
    shadowsocks=server2.address.com:25565, method=chacha20-ietf-poly1305, password=password, fast-open=false, udp-relay=false, tag=random-server-3
    ```
- Generate Clash config file
    ```node
    const conf = sslink.Clash.preset() // Getting preset config file
    
    const conf = new sslink.Clash.ClashConf() // Or build your own config
    conf.addPolicy('auto', 'url-test', 'www.google.com', 300)
    conf.addRules([
        ['IP-CIDR', '10.0.0.0/8', 'DIRECT'],
        ['IP-CIDR', '127.0.0.0/8', 'DIRECT'],
        ['IP-CIDR', '172.16.0.0/12', 'DIRECT'],
        ['IP-CIDR', '192.168.0.0/16', 'DIRECT'],
        ['IP-CIDR', '224.0.0.0/24', 'DIRECT'],
        ['GEOIP', 'CN', 'DIRECT'],
        ['MATCH', undefined, 'auto'],
    ])

    // Adding proxy groups
    conf.addPolicy('GROUP-1', 'url-test', 'https://www.amazon.co.jp/')
    conf.addPolicy('GROUP-2', 'url-test', 'https://www.google.com')
    for (const p of servers) {
        conf.addProxyItem(p)
        conf.addPolicyItem('auto', p.tag)
        for (const g of p.policyGroup) {
            try {
                conf.addPolicyItem(g, p.tag)
            } catch (e) {}
        }
    }
    conf.addRules([
        ['DOMAIN', 'domain1.com', 'DIRECT'],
        ['DOMAIN-SUFFIX', 'domain2.com', 'GROUP-2'],
        ['DOMAIN-SUFFIX', 'domain3.com', 'GROUP-1'],
    ])
    console.log(conf.toString())
    ```

## License
MIT © MamoruDS