import { IsNotEmpty } from 'class-validator';

export class TokenPayload {
  @IsNotEmpty()
  user_id: string;
}

export default TokenPayload;