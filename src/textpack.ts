class TextPack {
    private _body: string
    private _localTitle: string

    constructor(body: string, options?: { localTitle?: string }) {
        this._body = body
        this._localTitle = options?.localTitle
    }

    public eval(options?: { isLocalBlock?: boolean }): string {
        let text: string = this._body
        if (options?.isLocalBlock) {
            if (this._localTitle) {
                text = this._localTitle + '\n' + text
            } else {
                throw new Error('local title is required for local block')
            }
        }
        return text.trimEnd() + '\n'
    }
}

export { TextPack }
