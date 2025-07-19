import { JwtAdapter } from "../../../config";
import { RegisterUserDto } from "../../dtos/auth/register-user.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth.repository";

interface UserToken {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}


interface RegisterUsecase {
    execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

type SignToken = (payload: Object, duration?: number) => Promise<string | null>;

export class RegisterUser implements RegisterUsecase {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly signToken: SignToken = JwtAdapter.generateToken
    ) {}

    async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {

        const user = await this.authRepository.register(registerUserDto);

        const token = await this.signToken({id: user.id});
        if(!token) throw CustomError.internalServer('Error generating token');
        
        return {
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    }


}