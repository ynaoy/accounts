import { useState } from "react";
import { useLoginFlgType } from "./types/useLoginFlg";

export const useLoginFlg = (defaultState:boolean = false): useLoginFlgType =>{
  /**
   * ログイン状態を管理するカスタムユーザーフック
   * @param {boolean} defaultState - 初期のログイン状態。デフォルトはfalse。
   * @returns {useLoginFlgType}  - リスト形式でログイン状態と更新関数を返す。
   */
  const [loginFlg, setLoginFlg] = useState<boolean>(defaultState);

  return [
    loginFlg,
    setLoginFlg,
  ];
};