import { Injectable } from "@nestjs/common";
import { ActionTokenVerifierService } from "../../services/action-token-verifier.service";

@Injectable()
export class VerifyResetPasswordTokenUseCase {
  constructor(
    private readonly actionTokenVerifierService: ActionTokenVerifierService,
  ) {}

  async execute(token: string): Promise<void> {
    await this.actionTokenVerifierService.verifyResetPasswordToken(token);
  }
}