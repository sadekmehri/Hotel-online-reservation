import { LoginAuthDto, RegisterAuthDto } from 'src/auth/dtos'

export const registerUserStub = (): RegisterAuthDto => {
  return {
    firstName: 'jhon',
    lastName: 'doe',
    email: 'xxx@gmail.com',
    cin: '00000000',
    dob: '1998-10-10',
    password: 'AA!45aaa@custom@password',
  }
}

export const loginUserStub = (): LoginAuthDto => {
  return {
    email: 'xxx@gmail.com',
    password: 'AA!45aaa@custom@password',
  }
}
