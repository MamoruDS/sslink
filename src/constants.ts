import { SpecialProxy, RuleType } from './types'

const REJECT = new SpecialProxy('REJECT')
const DIRECT = new SpecialProxy('DIRECT')

const RULE_SUPPORT_MAP_CLASH = {
    [RuleType.DOMAIN]: 'DOMAIN',
    [RuleType.DOMAIN_SUFFIX]: 'DOMAIN-SUFFIX',
    [RuleType.DOMAIN_KEYWORD]: 'DOMAIN-KEYWORD',
    [RuleType.IP_CIDR]: 'IP-CIDR',
    [RuleType.IP_CIDR_6]: 'IP-CIDR6',
    [RuleType.GEOIP]: 'GEOIP',
    [RuleType.SRC_IP_CIDR]: 'SRC-IP-CIDR', // TODO:
    [RuleType.DEST_PORT]: 'DST-PORT',
    [RuleType.SRC_PORT]: 'SRC-PORT',
    [RuleType.PROCESS_NAME]: 'PROCESS-PATH',
    [RuleType.FINAL]: 'MATCH',
}

const RULE_SUPPORT_MAP_SURGE = {
    [RuleType.DOMAIN]: 'DOMAIN',
    [RuleType.DOMAIN_SUFFIX]: 'DOMAIN-SUFFIX',
    [RuleType.DOMAIN_KEYWORD]: 'DOMAIN-KEYWORD',
    [RuleType.IP_CIDR]: 'IP-CIDR',
    [RuleType.IP_CIDR_6]: 'IP-CIDR6',
    [RuleType.GEOIP]: 'GEOIP',
    [RuleType.SRC_IP_CIDR]: 'SRC-IP',
    [RuleType.DEST_PORT]: 'DEST-PORT',
    [RuleType.SRC_PORT]: 'SRC-PORT',
    [RuleType.PROCESS_NAME]: 'PROCESS-NAME',
    [RuleType.FINAL]: 'FINAL',
}

export {
    SpecialProxy,
    RULE_SUPPORT_MAP_CLASH,
    RULE_SUPPORT_MAP_SURGE,
    //
    DIRECT,
    REJECT,
}
