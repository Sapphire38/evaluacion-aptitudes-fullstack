import { InternalValidationError } from "../errors/BaseErrors";

export class FirmaDigital {
    private readonly value: string;

    constructor(value: string) {
        if (!value) {
            throw new InternalValidationError("La firma digital es obligatoria");
        }

        const base64Pattern = /^data:image\/(png|jpeg|jpg);base64,[a-zA-Z0-9+/]+=*$/;

        if (!base64Pattern.test(value)) {
            throw new InternalValidationError("El formato de la firma digital no es válido");
        }

        this.value = value;
    }

    getValue(): string {
        return this.value;
    }

    toJSON(): string {
        return this.value;
    }
}