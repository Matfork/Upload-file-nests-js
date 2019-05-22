import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  private readonly users: User[] = [];
  constructor(private readonly jwtService: JwtService) {}

  public async getUsers() {
    return this.users;
  }

  async createToken(email: string) {
    const user: JwtPayload = { email };
    return this.jwtService.sign(user);
  }

  async createUser(data: User) {
    if (this.users.some(el => el.email === data.email)) {
      throw new BadRequestException('User with email provided already exists');
    }
    this.users.push(data);
    return true;
  }
}
