import { ValidationStateType, ValidationActionType } from "./types/useFormValidationReducer";

export const initialState:ValidationStateType = {
  userNameValidations: [],
  emailValidations: [],
  passwordValidations: [],
};

export function useFormValidationReducer(validationStates:ValidationStateType, action: ValidationActionType) {
  switch (action.type) {
    case "update_userName_validations": {
      return {
        ...validationStates,
        userNameValidations: action.userNameValidations,
      };
    }

    case "update_email_validations": {
      return {
        ...validationStates,
        emailValidations: action.emailValidations,
      };
    }

    case "update_password_validations": {
      return {
        ...validationStates,
        passwordValidations:  action.passwordValidations
      };
    }

    case "update_login_validations": {
      return {
        ...validationStates,
        emailValidations: action.emailValidations,
        passwordValidations:  action.passwordValidations
      };
    }
    
    case "update_state": {
      return {
        ...validationStates,
        userNameValidations: action.userNameValidations,
        emailValidations: action.emailValidations,
        passwordValidations:  action.passwordValidations
      };
    }
    default:{
      return validationStates;
    }
  }
}

export const checkUserName = (userName:string)=>{
  /**
   * ユーザーネームのバリデーションを実行
  **/

  const strSize:number = userName.length 
  let Validations:string[] = []

  if (strSize==0) Validations.push("ユーザーネームを入力してください")
  if (strSize>15) Validations.push("ユーザーネームが長すぎます")

  return Validations
}

export const checkEmail = (email:string)=>{
  /**
   * メールアドレスのバリデーションを実行
   * @return {string[]}
  **/

  const strSize:number = email.length 
  let Validations:string[] = []

  if(strSize==0) Validations.push("メールアドレスを入力してください")
  
  return Validations
}

export const checkPassword = (password:string)=>{
  /**
   * パスワードのバリデーションを実行
   * @return {string[]}
  **/

  const strSize:number = password.length
  let Validations:string[] = []

  if(strSize==0) Validations.push("パスワードを入力してください")
  
  return Validations
}
