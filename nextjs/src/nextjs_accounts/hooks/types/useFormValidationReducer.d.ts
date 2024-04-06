export type ValidationStateType = {
  userName: string;
  email: string;
  password: string;
}

export type ValidationActionType = {
  type: 'check_validation', formState: ValidationStateType //formStateとValidationStateを管理する変数は別だけど型は同じ
}