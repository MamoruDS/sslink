interface _PlatItem {
    parse(platform: Supported): string
}

class CTR<T extends _PlatItem> {
    protected _items: T[]

    constructor() {
        this._items = []
    }

    get items(): T[] {
        return this._items
    }

    public push(...items: T[]): void {
        this._items.push(...items)
    }

    protected _stringify(platform: Supported): string[] {
        return this._items.map((item) => item.parse(platform))
    }
}

class SpecialProxy {
    private readonly _name: string
    constructor(name: string) {
        this._name = name
    }
    toString(): string {
        return this._name
    }
}

enum RuleType {
    DOMAIN,
    DOMAIN_SUFFIX,
    DOMAIN_KEYWORD,
    IP_CIDR,
    IP_CIDR_6,
    GEOIP,
    SRC_IP_CIDR,
    DEST_PORT,
    SRC_PORT,
    PROCESS_NAME,
    FINAL,
    COMMENT,
}

type IP_Based_Rules = RuleType.IP_CIDR | RuleType.IP_CIDR_6 | RuleType.GEOIP
type Port_Based_Rules = RuleType.DEST_PORT | RuleType.SRC_PORT

enum Supported {
    Clash,
    Surge,
}

type CountryCode = //ISO 3166
    // Africa
    | 'AO'
    | 'BF'
    | 'BI'
    | 'BJ'
    | 'BW'
    | 'CD'
    | 'CF'
    | 'CG'
    | 'CI'
    | 'CM'
    | 'CV'
    | 'DJ'
    | 'DZ'
    | 'EG'
    | 'EH'
    | 'ER'
    | 'ET'
    | 'GA'
    | 'GH'
    | 'GM'
    | 'GN'
    | 'GQ'
    | 'GW'
    | 'KE'
    | 'KM'
    | 'LR'
    | 'LS'
    | 'LY'
    | 'MA'
    | 'MG'
    | 'ML'
    | 'MR'
    | 'MU'
    | 'MW'
    | 'MZ'
    | 'NA'
    | 'NE'
    | 'NG'
    | 'RE'
    | 'RW'
    | 'SC'
    | 'SD'
    | 'SH'
    | 'SL'
    | 'SN'
    | 'SO'
    | 'ST'
    | 'SZ'
    | 'TD'
    | 'TG'
    | 'TN'
    | 'TZ'
    | 'UG'
    | 'YT'
    | 'ZA'
    | 'ZM'
    | 'ZW'
    | 'SS'
    // Antarctica
    | 'AQ'
    | 'BV'
    | 'GS'
    | 'HM'
    | 'TF'
    // Asia
    | 'AE'
    | 'AF'
    | 'AM'
    | 'AP'
    | 'AZ'
    | 'BD'
    | 'BH'
    | 'BN'
    | 'BT'
    | 'CC'
    | 'CN'
    | 'CX'
    | 'CY'
    | 'GE'
    | 'HK'
    | 'ID'
    | 'IL'
    | 'IN'
    | 'IO'
    | 'IQ'
    | 'IR'
    | 'JO'
    | 'JP'
    | 'KG'
    | 'KH'
    | 'KP'
    | 'KR'
    | 'KW'
    | 'KZ'
    | 'LA'
    | 'LB'
    | 'LK'
    | 'MM'
    | 'MN'
    | 'MO'
    | 'MV'
    | 'MY'
    | 'NP'
    | 'OM'
    | 'PH'
    | 'PK'
    | 'PS'
    | 'QA'
    | 'SA'
    | 'SG'
    | 'SY'
    | 'TH'
    | 'TJ'
    | 'TL'
    | 'TM'
    | 'TW'
    | 'UZ'
    | 'VN'
    | 'YE'
    // Europe
    | 'AD'
    | 'AL'
    | 'AT'
    | 'AX'
    | 'BA'
    | 'BE'
    | 'BG'
    | 'BY'
    | 'CH'
    | 'CZ'
    | 'DE'
    | 'DK'
    | 'EE'
    | 'ES'
    | 'EU'
    | 'FI'
    | 'FO'
    | 'FR'
    | 'GB'
    | 'GG'
    | 'GI'
    | 'GR'
    | 'HR'
    | 'HU'
    | 'IE'
    | 'IM'
    | 'IS'
    | 'IT'
    | 'JE'
    | 'LI'
    | 'LT'
    | 'LU'
    | 'LV'
    | 'MC'
    | 'MD'
    | 'ME'
    | 'MK'
    | 'MT'
    | 'NL'
    | 'NO'
    | 'PL'
    | 'PT'
    | 'RO'
    | 'RS'
    | 'RU'
    | 'SE'
    | 'SI'
    | 'SJ'
    | 'SK'
    | 'SM'
    | 'TR'
    | 'UA'
    | 'VA'
    | 'FX'
    // North America
    | 'AG'
    | 'AI'
    | 'AW'
    | 'BB'
    | 'BL'
    | 'BM'
    | 'BS'
    | 'BZ'
    | 'CA'
    | 'CR'
    | 'CU'
    | 'DM'
    | 'DO'
    | 'GD'
    | 'GL'
    | 'GP'
    | 'GT'
    | 'HN'
    | 'HT'
    | 'JM'
    | 'KN'
    | 'KY'
    | 'LC'
    | 'MF'
    | 'MQ'
    | 'MS'
    | 'MX'
    | 'NI'
    | 'PA'
    | 'PM'
    | 'PR'
    | 'SV'
    | 'TC'
    | 'TT'
    | 'US'
    | 'VC'
    | 'VG'
    | 'VI'
    | 'AN'
    | 'BQ'
    | 'SX'
    // Australia
    | 'AS'
    | 'AU'
    | 'CK'
    | 'FJ'
    | 'FM'
    | 'GU'
    | 'KI'
    | 'MH'
    | 'MP'
    | 'NC'
    | 'NF'
    | 'NR'
    | 'NU'
    | 'NZ'
    | 'PF'
    | 'PG'
    | 'PN'
    | 'PW'
    | 'SB'
    | 'TK'
    | 'TO'
    | 'TV'
    | 'UM'
    | 'VU'
    | 'WF'
    | 'WS'
    // South America
    | 'AR'
    | 'BO'
    | 'BR'
    | 'CL'
    | 'CO'
    | 'EC'
    | 'FK'
    | 'GF'
    | 'GY'
    | 'PE'
    | 'PY'
    | 'SR'
    | 'UY'
    | 'VE'
    | 'CW'
    | 'LAN' // Clash only

export { CTR, SpecialProxy }
export { CountryCode, IP_Based_Rules, Port_Based_Rules, RuleType, Supported }
