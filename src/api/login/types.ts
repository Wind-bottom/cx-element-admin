export interface UserLoginType {
  username: string
  password: string
  cx:string
}

export interface UserType {
  username: string
  password: string
  role: string
  roleId: string
  permissions: string | string[]
}
