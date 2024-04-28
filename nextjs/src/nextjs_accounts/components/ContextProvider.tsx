"use client";

import { LoginFlgContextProvider } from '../hooks/LoginFlgContext'

export default function ContextProvider({children}: {children: React.ReactNode}) {

  // グローバル変数からloginFlgの更新用関数を取得
  //const setLoginFlg = useSetLoginFlgContext()

  //useEffect(()=>{
  //  setLoginFlg(()=>loginFlg)
  //},[])

  return (
    <LoginFlgContextProvider>
      {children}
    </LoginFlgContextProvider>
  )
}