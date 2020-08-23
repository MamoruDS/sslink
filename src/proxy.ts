type Target = 'clash' | 'quantumult'

const PARSERS = {} as {
    [key in Target]: (item: BaseProxy, options: object) => string | object
}

// type parser<K extends string = ''> = K extends keyof typeof PARSERS ? K : never

export class BaseProxy {
    public readonly server: string
    public readonly port: number
    public readonly tag: string
    public policyGroup: string[]

    constructor(
        tag: string,
        server: string,
        port: number,
        policyGroup: string[] = []
    ) {
        this.tag = tag
        this.server = server
        this.port = port
        this.policyGroup = policyGroup
    }

    addPolicyGroup(groupname: string): void {
        this.policyGroup.push(groupname)
    }
    parse(target: Target, options: object = {}) {
        return PARSERS[target](this, options)
    }
}

import { quantumultParser, clashParser } from './parser'

PARSERS['clash'] = clashParser
PARSERS['quantumult'] = quantumultParser
