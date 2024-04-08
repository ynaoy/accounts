import { setLoginFlgType } from "./useLoginFlg";

export type ValidationStateType = {
  userNameValidations: string[];
  emailValidations: string[];
  passwordValidations: string[];
}

export type ValidationActionType = {
  type: 'update_state', userNameValidations: string[], emailValidations: string[], passwordValidations: string[],
}