
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class InputCreateUser {
    id: number;
    email: string;
    firstName: string;
    lastName?: string;
    age?: number;
    role: string;
}

export abstract class IMutation {
    abstract addUser(createUserInput?: InputCreateUser): User | Promise<User>;
}

export abstract class IQuery {
    abstract getAllUsers(): User[] | Promise<User[]>;

    abstract getUser(id: string): User | Promise<User>;
}

export abstract class ISubscription {
    abstract userCreated(): User | Promise<User>;
}

export class User {
    id: number;
    email: string;
    firstName: string;
    lastName?: string;
    age?: number;
    role: string;
    details?: UserDetails;
}

export class UserDetails {
    nick?: string;
    status?: number;
}
