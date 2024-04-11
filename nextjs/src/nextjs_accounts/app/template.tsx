"use client";
/**
 * コンポーネントをラップするテンプレート
 * 画面の遷移時に再レンダーされる
 */
import 'tailwindcss/tailwind.css'
import { useEffect } from 'react'
import { useFetch  } from '../hooks/useFetch';
import { LoginFlgContextProvider, useSetLoginFlgContext } from '../hooks/LoginFlgContext'

export default function RootTemplate({children,}: {children: React.ReactNode}) {
  // APIと通信する関数を受け取る
  const { fetchLoginFlg } = useFetch()
  // グローバル変数からloginFlgの更新用関数を取得
  const setLoginFlg = useSetLoginFlgContext()

  // APIと通信して、LoginFlgを更新する関数
  const fetchData = async()=>{
    let {loginFlg} = await fetchLoginFlg()
    setLoginFlg(loginFlg)
  }
  useEffect(()=>{
    fetchData()
  },[])

  return (
    <div className="bg-white dark:bg-slate-800 flex flex-col justify-center items-center h-screen w-screen">
      <LoginFlgContextProvider>
        {children}
      </LoginFlgContextProvider>
    </div>
  )
}
