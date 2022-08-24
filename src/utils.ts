const optionalArgs = (key: string, val?: any): string => {
    if (typeof val != 'undefined') {
        return key + '=' + val
    } else {
        return undefined
    }
}

const undefinedFreeJoin = <T = any>(
    arr: T[],
    separator: string
    // filter: (x: T) => boolean
): string => {
    return arr.filter((x) => typeof x != 'undefined').join(separator)
}

export { optionalArgs, undefinedFreeJoin }
