import { setLoginFlgType } from "./useLoginFlg";

export type ValidationStateType = {
  userNameValidations: string[];
  emailValidations: string[];
  passwordValidations: string[];
}

export type ValidationActionType = { type: "update_userName_validations" , userNameValidations: string[]} 
                                  |{ type: "update_email_validations" , emailValidations: string[]} 
                                  |{ type: "update_password_validations" , passwordValidations: string[]} 
                                  |{ type: "update_login_validations" , emailValidations: string[], 
                                                                        passwordValidations: string[]} 
                                  |{ type: "update_state" , userNameValidations: string[], 
                                                            emailValidations: string[], 
                                                            passwordValidations: string[]} 