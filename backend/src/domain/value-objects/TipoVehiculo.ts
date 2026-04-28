import { InternalValidationError } from "../errors/BaseErrors";

export enum TiposVehiculo {
    CAMION = "Camion",
    AUTO = "Auto",
    MOTO = "Moto",
}

export class TipoVehiculo {
    private readonly value: TiposVehiculo;

    constructor(value: string | TiposVehiculo) {
        if (!Object.values(TiposVehiculo).includes(value as TiposVehiculo)) {
            throw new InternalValidationError(`Tipo de vehiculo inválido: ${value}`);
        }
        this.value = value as TiposVehiculo;
    }

    getValue(): TiposVehiculo {
        return this.value;
    }

    toJSON(): string {
        return this.value;
    }

    static create(value: string): TipoVehiculo {
        return new TipoVehiculo(value);
    }
}
