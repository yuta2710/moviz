export interface UserRegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  gender: string;
  role: string;
}

export interface UserUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}
