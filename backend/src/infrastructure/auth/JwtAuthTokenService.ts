import { IAuthTokenPayload, IAuthTokenService } from "../../domain/services/IAuthTokenService";
import jwt from 'jsonwebtoken';
import ms from "ms";
import { UnauthorizedOperationError } from "../../domain/errors/BaseErrors";

export class JwtAuthTokenService implements IAuthTokenService {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor(secret?:string,expiresIn?:string){
        this.secret = secret || process.env.JWT_SECRET || 'secret';
        this.expiresIn = expiresIn || process.env.JWT_EXPIRES_IN || '7d';
    }

    async generarToken(payload: IAuthTokenPayload): Promise<{value:string,expiresIn:number}> {
        const expiresIn = ms(this.expiresIn as ms.StringValue)  //convertimos el tiempo de expiracion a milisegundos
        const token = jwt.sign(payload, this.secret, {expiresIn });
        return {value:token,expiresIn};
    }

    async verificarToken(token: string): Promise<IAuthTokenPayload> {
        try {
            return jwt.verify(token, this.secret) as IAuthTokenPayload;
        } catch (error) {
            throw new UnauthorizedOperationError('Autenticación', 'Token inválido');
        }
    }

}