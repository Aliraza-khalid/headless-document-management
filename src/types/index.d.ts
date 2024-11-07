declare namespace Express {
  export interface Request {
    user: RequestUser;
  }
  export interface RequestUser {
    userId: string;
    email: string;
    role: string;
  }
}
