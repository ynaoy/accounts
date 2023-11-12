/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { useLoginFlg } from "../../hooks/useLoginFlg";

describe("useLoginFlg", ()=>{
  
  test("setLoginFlg(value)が実行された時、セットされた値でレンダーされる", () => {
    // レンダー
    const { result } = renderHook(() => useLoginFlg(false))
    
    // loginFlgとsetLoginFlgを取得
    const [loginFlg, setLoginFlg] = result.current;
    // loginFlgの初期値がfalseになっている
    expect(loginFlg).toBe(false);

    //loginFlgをtrueに更新して再レンダー
    act(() => {
      setLoginFlg(true);
    })
     // 再レンダー後のloginFlgを取得
    let nextLoginFlg = result.current[0]
    // loginFlgがtrueになっている
    expect(nextLoginFlg).toBe(true);
  });
})