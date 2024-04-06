/**
 * @jest-environment jsdom
 */
import { renderHook} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { useReducer } from "react";
import { initialState, useFormReducer } from "../../hooks/useFormReducer";

describe("userFormReducer", ()=>{
  
  test("Reducerの生成と初期値のテスト", () => {
    const { result } = renderHook(() => useReducer(useFormReducer, initialState));
    
    // stateとdispatchの取得
    const [state] = result.current;
    
    //初期値の確認
    expect(state).toEqual(initialState);
  })

  test("UserNameの更新のテスト", () => {
    let userName="Edited UserName"
    const { result } = renderHook(() => useReducer(useFormReducer, initialState))

    //dispatchの取得
    const [, dispatch] = result.current;

    //ユーザーネームの更新
    act(() => {
      dispatch({
        type: "edited_userName",
        userName: userName,
      });
    })

    //ユーザーネームが更新されている
    expect(result.current[0].userName).toBe(userName);
  })

  test("Emailの更新のテスト", () => {
    let email="Edited Email"
    const { result } = renderHook(() => useReducer(useFormReducer, initialState))

    //dispatchの取得
    const [, dispatch] = result.current

    //メールアドレスの更新
    act(() => {
      dispatch({
        type: "edited_email",
        email: email,
      });
    })

    //メールアドレスが更新されている
    expect(result.current[0].email).toBe(email);
  })

  test("Passwordの更新のテスト", () => {
    let password="Edited Password"
    const { result } = renderHook(() => useReducer(useFormReducer, initialState))

    //dispatchの取得
    const [, dispatch] = result.current
    
    //パスワードの更新
    act(() => {
      dispatch({
        type: "edited_password",
        password: password,
      });
    })
    //パスワードが更新されている
    expect(result.current[0].password).toBe(password);
  })

  test("Stateのリセットのテスト", () => {
    const resetstate = { 
      userName:"userName",
      email:"email",
      password:"password"}
    const { result } = renderHook(() => useReducer(useFormReducer,  resetstate))

    //dispatchの取得
    const [, dispatch] = result.current
    
    //stateのリセット
    act(() => {
      dispatch({
        type: "reset_form",
      });
    })

    //stateがリセットされている
    expect(result.current[0]).toEqual(initialState);
  })

})