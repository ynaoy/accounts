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

  test("ユーザーネームが空の場合のバリデーションのテスト", () => {
    //リデューサーの初期化
    const { result } = renderHook(() => useReducer(useFormValidationReducer, initialState))

    //dispatchの取得
    const [, dispatch] = result.current;

    //空のユーザーネームで更新
    act(() => {
      dispatch({
        type: "check_validation",
        formState: {
          userName: "",
          email: "example@example.com",
          password: "password"
        },
      });
    })

    //ユーザーネームのバリデーションが更新されている
    expect(result.current[0].userName).toBe("ユーザーネームを入力してください");
  })

  test("ユーザーネームが長すぎる場合のバリデーションのテスト", () => {
    //リデューサーの初期化
    const { result } = renderHook(() => useReducer(useFormValidationReducer, initialState))

    //dispatchの取得
    const [, dispatch] = result.current;

    //16文字以上の長すぎるユーザーネームで更新
    act(() => {
      dispatch({
        type: "check_validation",
        formState: {
          userName: "aaaaaaaaaaaaaaaa",
          email: "example@example.com",
          password: "password"
        },
      });
    })

    //ユーザーネームのバリデーションが更新されている
    expect(result.current[0].userName).toBe("ユーザーネームが長すぎます");
  })

  test("メールアドレスが空の場合のバリデーションのテスト", () => {
    //リデューサーの初期化
    const { result } = renderHook(() => useReducer(useFormValidationReducer, initialState))

    //dispatchの取得
    const [, dispatch] = result.current;

    //空のメールアドレスで更新
    act(() => {
      dispatch({
        type: "check_validation",
        formState: {
          userName: "test user",
          email: "",
          password: "password"
        },
      });
    })

    //メールアドレスのバリデーションが更新されている
    expect(result.current[0].email).toBe("メールアドレスを入力してください");
  })

  test("パスワードが空の場合のバリデーションのテスト", () => {
    //リデューサーの初期化
    const { result } = renderHook(() => useReducer(useFormValidationReducer, initialState))

    //dispatchの取得
    const [, dispatch] = result.current;

    //空のパスワードで更新
    act(() => {
      dispatch({
        type: "check_validation",
        formState: {
          userName: "test user",
          email: "example@example.com",
          password: ""
        },
      });
    })

    //パスワードのバリデーションが更新されている
    expect(result.current[0].password).toBe("パスワードを入力してください");
  })
})