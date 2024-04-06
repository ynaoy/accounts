import { UserStateType ,UserActionType } from "./types/useFormReducer";

export const initialState:UserStateType = {
  userName: "",
  email: "",
  password:"",
};

export function useFormReducer(state:UserStateType, action:UserActionType) {
  switch (action.type) {
    case "edited_userName": {
      return {
        ...state,
        userName: action.userName,
      };
    }
    case "edited_email": {
      return {
        ...state,
        email: action.email,
      };
    }
    case "edited_password": {
      return {
        ...state,
        password: action.password,
      };
    }
    case "reset_form": {
      return {
        userName: "",
        email: "",
        password:"",
      };
    }
    default:{
      return state;
    }
  }
}
