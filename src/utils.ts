export const encodeBase64 = (str: string): string => {
    return Buffer.from(str, 'utf-8').toString('base64')
}

export const decodeBase64 = (str: string): string => {
    return Buffer.from(str, 'base64').toString('utf-8')
}

export const copy = <T>(source: T): T => {
    if (source === null) return source
    if (Array.isArray(source)) {
        const _t = [] as any[]
        source.map((v) => {
            _t.push(copy(v))
        })
        return _t as any
    }
    if (typeof source === 'object') {
        if (source.constructor.name !== 'Object') {
            return source
        }
        const _t = {} as T
        for (const key of Object.keys(source)) {
            _t[key] = copy(source[key])
        }
        return _t
    }
    return source
}

export type Optional<T extends object> = {
    [key in keyof T]?: T[key] extends object ? Optional<T[key]> : T[key]
}

export const assignDefault = <T extends object>(
    defaultOptions: Required<T>,
    inputOptions: Optional<T>
): Required<T> => {
    if (
        typeof inputOptions !== 'object' ||
        inputOptions === null ||
        Array.isArray(inputOptions)
    ) {
        throw new TypeError('Input options expect an object to be entered')
    }
    const _options = copy(defaultOptions)
    assign(_options, inputOptions)
    return _options
}

const assign = <T extends object>(
    target: Required<T>,
    input: Optional<T>,
    assignExistOnly?: boolean
): void => {
    for (const key of Object.keys(target)) {
        const _val = input[key]
        if (typeof _val != 'undefined') {
            if (_val == null) {
                target[key] = null
                continue
            }
            if (Array.isArray(_val)) {
                for (const i in target[key]) {
                    const __val = _val[i]
                    if (typeof __val == 'undefined') continue
                    if (
                        typeof target[key][i] == 'object' &&
                        !Array.isArray(target) &&
                        target != null
                    ) {
                        assign(target[key][i], _val[i])
                    } else {
                        target[key][i] = __val
                    }
                }
                continue
            }
            if (typeof _val == 'object' && _val != {}) {
                assign(target[key], _val)
                continue
            }
            target[key] = _val
            continue
        }
    }
    for (const key of Object.keys(input)) {
        if (typeof target[key] == 'undefined' && !assignExistOnly) {
            target[key] = copy(input[key])
        }
    }
}
