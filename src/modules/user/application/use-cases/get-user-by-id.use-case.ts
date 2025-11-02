import { Injectable } from "@nestjs/common";
import { UserModel } from "../../domain/models/user.model";
import { UserFinderService } from "../services/user-finder.service";

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
  ) {}

  execute(id: number): Promise<UserModel> {
    return this.userFinderService.getById(id);
  }
}