import { Request } from "express";
import { IUser } from "./model";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
