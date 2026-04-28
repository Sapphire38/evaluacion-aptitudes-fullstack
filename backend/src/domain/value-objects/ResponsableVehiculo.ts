import { Area } from "./Area";
import { TipoResponsable, TiposResponsable } from "./TipoResponsable";

export class ResponsableVehiculo {
    public readonly idOrNombre: string;
    public readonly tipo: TipoResponsable;

    constructor(
        idOrNombre: string,
        tipo: TipoResponsable
    ) {
        this.idOrNombre = idOrNombre;
        this.tipo = tipo;
    }

    static deUsuario(usuarioId: string): ResponsableVehiculo {
        return new ResponsableVehiculo(usuarioId, new TipoResponsable(TiposResponsable.USUARIO));
    }

    static deArea(areaNombre: string): ResponsableVehiculo {
        const area = new Area(areaNombre);
        return new ResponsableVehiculo(area.getValue(), new TipoResponsable(TiposResponsable.AREA));
    }

    getValor(): string { return this.idOrNombre; }

    getTipo(): TipoResponsable { return this.tipo; }

    esArea(): boolean {
        return this.tipo.getValue() === TiposResponsable.AREA;
    }

    esUsuario(): boolean {
        return this.tipo.getValue() === TiposResponsable.USUARIO;
    }

    toJSON(): { id: string; tipo: string } {
        return { id: this.idOrNombre, tipo: this.tipo.getValue() };
    }
}