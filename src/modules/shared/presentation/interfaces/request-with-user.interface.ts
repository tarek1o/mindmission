import { Request } from "express";
import { UserSession } from "./user-session.interface";

export interface RequestWithUser extends Request {
  user: UserSession;
}