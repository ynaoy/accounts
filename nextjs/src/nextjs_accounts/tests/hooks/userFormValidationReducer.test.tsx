/**
 * @jest-environment jsdom
 */
import { renderHook} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { useReducer } from "react";
import { initialState, useFormValidationReducer } from "../../hooks/useFormValidationReducer";

describe("useFormValidationReducer", ()=>{
  
  test("Reducerの生成と初期値のテスト", () => {
    const { result } = renderHook(() => useReducer(useFormValidationReducer, initialState));
    
    // stateとdispatchの取得
    const [state, dispatch] = result.current;
    
    //初期値の確認
    expect(state).toEqual(initialState);
  })

  test("stateが更新された場合のバリデーションのテスト", () => {
    //リデューサーの初期化
    const { result } = renderHook(() => useReducer(useFormValidationReducer, initialState))

    //dispatchの取得
    const [, dispatch] = result.current;

    act(() => {
      dispatch({
        type: "update_state",
        userNameValidations: ["ユーザーネームを入力してください"],
        emailValidations: ["メールアドレスを入力してください"],
        passwordValidations: ["パスワードを入力してください"]
      });
    })

    //stateが更新されている
    expect(result.current[0].userNameValidations).toContain("ユーザーネームを入力してください");
    expect(result.current[0].emailValidations).toContain("メールアドレスを入力してください");
    expect(result.current[0].passwordValidations).toContain("パスワードを入力してください");
  })
})