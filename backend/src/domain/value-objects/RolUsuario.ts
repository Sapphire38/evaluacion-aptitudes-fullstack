import { InternalValidationError } from "../errors/BaseErrors";

export enum Roles {
    ADMIN = 'ADMIN',
    CONDUCTOR = 'CONDUCTOR',
}

export const JerarquiaRoles: Record<Roles,number> = {
    [Roles.ADMIN]: 1,
    [Roles.CONDUCTOR]: 2,
}

export type TipoRol = Roles;

export class RolUsuario {
    private readonly value: Roles;

    constructor(value: string | Roles) {
        if (!this.isValid(value)) {
            throw new InternalValidationError(`Rol inválido: ${value}`);
        }
        this.value = value as Roles;
    }

    private isValid(value: string): boolean {
        return Object.values(Roles).includes(value as Roles);
    }

    getValue(): string {
        return this.value;
    }

    esConductor(): boolean {
        return this.value === Roles.CONDUCTOR;
    }

    esAdmin(): boolean {
        return this.value === Roles.ADMIN;
    }

    getJerarquia(): number {
        return JerarquiaRoles[this.value];
    };
    
    esAlMenos(rol: Roles | RolUsuario): boolean {
        if(rol instanceof RolUsuario){
            return this.getJerarquia() >= rol.getJerarquia();
        }
        return this.getJerarquia() >= JerarquiaRoles[rol];
    }

    toJSON(): string {
        return this.value;
    }

    static create(value: string): RolUsuario {
        return new RolUsuario(value);
    }
}