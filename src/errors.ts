class NotImplementedError extends Error {}
class NotSupportedError extends Error {
    platform: any
    desc: string
    constructor(platform: any, desc?: string) {
        super()
        this.platform = platform
        this.desc = desc
    }
}

export { NotImplementedError, NotSupportedError }
