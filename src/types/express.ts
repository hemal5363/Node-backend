import { Request } from "express";
import { Document } from "mongoose";

import { IUser, IUSerMethods } from "./model";

export interface AuthenticatedRequest extends Request {
  user?:
    | (Document<unknown, {}, IUser, {}, {}> &
        Omit<
          IUser &
            Required<{
              _id: unknown;
            }> & {
              __v: number;
            },
          keyof IUSerMethods
        > &
        IUSerMethods)
    | null;
}
