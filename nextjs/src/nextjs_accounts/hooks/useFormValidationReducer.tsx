import { ValidationStateType, ValidationActionType } from "./types/useFormValidationReducer";

export const initialState:ValidationStateType = {
  userName: "",
  email: "",
  password:"",
};

export function useFormValidationReducer(validationState:ValidationStateType, action: ValidationActionType) {
  switch (action.type) {
    case "check_validation": {
      const userNameValidation = checkUserName(action.formState["userName"])
      const emailValidation = checkEmail(action.formState["email"])
      const passwordValidation = checkPassword(action.formState["password"])
      return {
        ...validationState,
        userName: userNameValidation,
        email: emailValidation,
        password:  passwordValidation
      };
    }
    default:{
      return validationState;
    }
  }
}

const checkUserName = (userName:string)=>{
  const strSize = userName.length 
  if (strSize==0) return "ユーザーネームを入力してください"
  if (strSize>15) return "ユーザーネームが長すぎます"
  return ""
}

const checkEmail = (email:string)=>{
  const strSize = email.length 
  if(strSize==0) return "メールアドレスを入力してください"
  return ""
}

const checkPassword = (password:string)=>{
  const strSize = password.length 
  if(strSize==0) return "パスワードを入力してください"
  return ""
}


