
import { User } from "src/modules/auth/entities/user.entity";

export const ExpressUserRequestKey = "user";

export type UserRequestBodyProps = Partial<User>;