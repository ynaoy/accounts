import { setLoginFlgType } from "./useLoginFlg";

export type ValidationStateType = {
  userName: string;
  email: string;
  password: string;
}

export type ValidationActionType = {
  type: 'update_state', userName: string, email: string, password: string,
}