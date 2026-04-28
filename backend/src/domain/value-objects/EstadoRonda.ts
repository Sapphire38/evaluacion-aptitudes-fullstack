import { InternalValidationError } from "../errors/BaseErrors";

export enum EstadosRonda {
    APTA = 'APTA',
    NO_APTA = 'NO APTA'
}

export class EstadoRonda {
    private readonly value: EstadosRonda;

    constructor(value: string | EstadosRonda) {
        if (!Object.values(EstadosRonda).includes(value as EstadosRonda)) {
            throw new InternalValidationError(`Estado de ronda inválido: ${value}`)
        }
        this.value = value as EstadosRonda;
    }

    esApta(): boolean {
        return this.value === EstadosRonda.APTA;
    }

    esNoApta(): boolean {
        return this.value === EstadosRonda.NO_APTA;
    }

    static create(value: string): EstadoRonda {
        return new EstadoRonda(value);
    }

    getValue(): string {
        return this.value;
    }

    toJSON(): string {
        return this.value;
    }
}
