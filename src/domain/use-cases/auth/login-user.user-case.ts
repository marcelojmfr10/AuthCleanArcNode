
import { JwtAdapter } from "../../../config";
import { LoginUserDto } from "../../dtos/auth/login-user.dto";
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


interface LoginUserUseCase {
    execute(loginUserDto: LoginUserDto): Promise<UserToken>;
}

type SignToken = (payload: Object, duration?: number) => Promise<string | null>;

export class LoginUser implements LoginUserUseCase {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly signToken: SignToken = JwtAdapter.generateToken
    ) {}

    async execute(loginUserDto: LoginUserDto): Promise<UserToken> {

        const user = await this.authRepository.login(loginUserDto);

        console.log({user});

        const token = await this.signToken({id: user.id});
        if(!token) throw CustomError.internalServer('Error generating token');
        
        console.log({token});
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