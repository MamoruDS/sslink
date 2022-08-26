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

    public get text(): string {
        return this._body
    }

    public standalone(): string {
        if (typeof this._standaloneCb == 'function') {
            return this._standaloneCb(this._body)
        } else {
            return this.text
        }
    }
}

export { TextPack }
