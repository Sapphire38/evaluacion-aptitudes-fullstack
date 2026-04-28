import { InternalValidationError } from "../errors/BaseErrors";

export enum EstadosConductor {
    ACTIVO = 'Activo',
    INACTIVO = 'Inactivo'
}

export class EstadoConductor {
    private readonly value: EstadosConductor;

    constructor(value: string | EstadosConductor) {
        if (!Object.values(EstadosConductor).includes(value as EstadosConductor)) {
            throw new InternalValidationError(`Estado de conductor inválido: ${value}`);
        }
        this.value = value as EstadosConductor;
    }

    getValue(): EstadosConductor {
        return this.value;
    }

    isActive(): boolean {
        return this.value === EstadosConductor.ACTIVO;
    }

    toJSON(): string {
        return this.value;
    }

    static create(value: string): EstadoConductor {
        return new EstadoConductor(value);
    }
}