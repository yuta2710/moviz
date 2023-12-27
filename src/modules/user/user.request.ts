export interface UserRegisterRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  gender: string;
}

export interface UserUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}
