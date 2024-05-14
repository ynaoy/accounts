"use client";
/**
 * コンポーネントをラップするテンプレート
 * 画面の遷移時に再レンダーされる
 */
import { useState, useRef, useEffect } from 'react'
import { useFetch  } from '../hooks/useFetch';
import { useSetLoginFlgContext } from '../hooks/LoginFlgContext'

export default function RootTemplate({children,}: {children: React.ReactNode}) {
  // APIと通信する関数を受け取る
  const { fetchLoginFlgFromFrontendServer } = useFetch()
  // グローバル変数からloginFlgの更新用関数を取得
  const setLoginFlg = useSetLoginFlgContext()
  // データのfetchが完了するまでローディング画面を表示しておく
  const [isLoading, setIsLoading] = useState(true);
  // マウント状態を管理する。更新時に再レンダーして欲しくないのでRefを使用
  const isMounted = useRef(false);

  const fetchData = async()=>{
    // APIと通信して、LoginFlgを更新する関数
    setIsLoading(true);
    try {
      const { data } = await fetchLoginFlgFromFrontendServer();
      if (isMounted.current) {
        // コンポーネントが既にアンマウントされていたらログイン状態を変更しない
        setLoginFlg(() => data['loginFlg']);
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(()=>{
    // コンポーネントのマウント状態を更新
    isMounted.current = true; 
    // ログイン状態の更新
    fetchData()
    return () => {
      // コンポーネントがアンマウントされた際にログイン情報を更新しないようにする
      isMounted.current = false;
    };
  },[])

  return (
    <div className="bg-white dark:bg-slate-800 flex flex-col justify-center items-center h-screen w-screen">
      { isLoading? "Loading...": children }
    </div>
  )
}
