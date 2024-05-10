export interface CreateUser {
  username: string;
  password: string;
  createdDate: string
  role: string;
  email: string;
  createdDay: string;
}

export interface UpdateUser {
  id: string;
  username: string;
  password: string;
  role: string;
  email: string;
}

export interface DeleteUser {
  id: string;
  username: string
}
