export const enum PasswordComplexity {
  PATTERN = '(?=.*d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$',
}

/*
The password must contain one or more uppercase characters
The password must contain one or more lowercase characters
The password must contain one or more numeric values
The password must contain one or more special characters
*/
