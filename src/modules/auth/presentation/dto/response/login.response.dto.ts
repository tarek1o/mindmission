import { LoginViewModel } from "src/modules/auth/application/view-models/login..view-model";
import { UserDetailsResponseDto } from "src/modules/user/presentation/dto/response/user-details.response.dto";

export class LoginResponseDto {
  user: UserDetailsResponseDto;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };

  constructor(loginViewModel: LoginViewModel) {
    this.user = new UserDetailsResponseDto(loginViewModel.user);
    this.tokens = loginViewModel.tokens;
  }
}