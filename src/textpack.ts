class TextPack {
    private readonly _reg: string
    private _body: string
    private _standaloneCb: (data: string) => string

    constructor(
        reg: string,
        body: string,
        standaloneCb?: (data: string) => string
    ) {
        this._reg = reg
        this._body = body
        this._standaloneCb = standaloneCb
    }

    public eval(options?: { standalone?: boolean }): string {
        let text: string = undefined
        if (options?.standalone) {
            if (typeof this._standaloneCb == 'function') {
                text = this._standaloneCb(this._body)
            }
        }
        text = text ?? this._body
        return text.trimEnd() + '\n'
    }
}

export { TextPack }
