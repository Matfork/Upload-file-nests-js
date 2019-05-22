import { Min } from 'class-validator';
import { InputCreateUser } from '../../graphql.schema';

export class CreateUserDto extends InputCreateUser {
  id: number;
  firstName: string;
  email: string;
  role: string;

  @Min(1)
  age: number;
}
