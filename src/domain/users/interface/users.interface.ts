import { Prisma } from '@prisma/client';

export type CreateUserProps = Prisma.UserCreateInput;
export type UserTypes = Prisma.UserWhereUniqueInput;

export interface LoginUserProps {
  email: string;
  password: string;
}

export interface AuthenticatedRequest extends Request {
  user: UserTypes;
}
