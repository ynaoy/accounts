import { ValidationStateType, ValidationActionType } from "./types/useFormValidationReducer";

export const initialState:ValidationStateType = {
  userName: "",
  email: "",
  password:"",
};

export function useFormValidationReducer(validationState:ValidationStateType, action: ValidationActionType) {
  switch (action.type) {
    case "update_state": {
      return {
        ...validationState,
        userName: action.userName,
        email: action.email,
        password:  action.password
      };
    }
    default:{
      return validationState;
    }
  }
}
