import { ValidationStateType, ValidationActionType } from "./types/useFormValidationReducer";

export const initialState:ValidationStateType = {
  userNameValidations: [],
  emailValidations: [],
  passwordValidations: [],
};

export function useFormValidationReducer(validationStates:ValidationStateType, action: ValidationActionType) {
  switch (action.type) {
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
