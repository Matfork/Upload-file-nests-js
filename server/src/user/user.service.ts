import { Injectable } from '@nestjs/common';
import { User } from '../graphql.schema';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: 1,
      email: 'jperez@gmail.com',
      firstName: 'Juan',
      lastName: 'Perez',
      age: 24,
      role: 'user',
      details: {
        nick: 'jhon snow',
        status: 1,
      },
    },
  ];

  create(user: User): User {
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOneById(id: number): User {
    return this.users.find(user => user.id === id);
  }
}
