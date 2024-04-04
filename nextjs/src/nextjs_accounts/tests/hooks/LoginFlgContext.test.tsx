/**
 * @jest-environment jsdom
 */
import { act, renderHook } from "@testing-library/react";
import { LoginFlgContextProvider, useLoginFlgContext, useSetLoginFlgContext } from "../../hooks/LoginFlgContext";

describe("LoginFlgContext", () => {
  test("子コンポーネント内で、setLoginFlg(value)が実行された時にloginFlgが同期する", () => {
    const ChildComponent = () => {
      /**
       * LoginFlgContextProviderの子コンポーネントとしてレンダーする
       */
      const loginFlg = useLoginFlgContext()
      const setLoginFlg = useSetLoginFlgContext()
      return { loginFlg, setLoginFlg };
    };

    // レンダー
    const { result } = renderHook(() => ChildComponent(), { wrapper: LoginFlgContextProvider });

    // 子コンポーネントからloginFlgとsetLoginFlgを取得
    const { loginFlg, setLoginFlg } = result.current;
    // loginFlgの初期値がfalseになっている
    expect(loginFlg).toBe(false);

    // loginFlgをtrueに更新して再レンダー
    act(() => {
      setLoginFlg(true);
    });
    // 再レンダー後のloginFlgを取得
    const nextLoginFlg = result.current.loginFlg;
    // loginFlgがtrueになっている
    expect(nextLoginFlg).toBe(true);
  });
});