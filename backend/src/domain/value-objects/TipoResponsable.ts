import { InternalValidationError } from "../errors/BaseErrors";

export enum TiposResponsable {
    USUARIO = "Usuario",
    AREA = "Area"
}

export class TipoResponsable {
    private readonly value: TiposResponsable;

    constructor(value: string | TiposResponsable) {
        if (!Object.values(TiposResponsable).includes(value as TiposResponsable)) {
            throw new InternalValidationError(`Tipo de responsable inválido: ${value}`);
        }
        this.value = value as TiposResponsable;
    }

    getValue(): TiposResponsable {
        return this.value;
    }

    toJSON(): string {
        return this.value;
    }

    static create(value: string): TipoResponsable {
        return new TipoResponsable(value);
    }
}