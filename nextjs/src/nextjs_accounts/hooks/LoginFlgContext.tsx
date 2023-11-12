/**
 * @jest-environment jsdom
 */
import { createContext, useContext} from "react";
import { setLoginFlgType } from "./types/useLoginFlg";
import { useLoginFlg } from "./useLoginFlg";

// loginFlgをグローバール変数として扱うためのコンテキスト
export const LoginFlgContext = createContext<boolean>(false);

// setLoginFlgをグローバール変数として扱うためのコンテキスト
export const SetLoginFlgContext = createContext<setLoginFlgType>(() => undefined);

// loginFlgを受け取る関数
export const useLoginFlgContext = () => useContext(LoginFlgContext);

// setLoginFlgを受け取る関数
export const useSetLoginFlgContext = () => useContext(SetLoginFlgContext);

export const LoginFlgContextProvider: React.FC<{children:React.ReactNode}> =({ children }) => {
  /**
   * このコンポーネント以下の子コンポーネントでloginFlg, setLoginFlgをグローバル変数として扱える
   */
  const [loginFlg, setLoginFlg] = useLoginFlg(false);

  return (
    <LoginFlgContext.Provider value={loginFlg}>
      <SetLoginFlgContext.Provider value={setLoginFlg}>
        {children}
      </SetLoginFlgContext.Provider>
    </LoginFlgContext.Provider>
  );
};