import { useLoginFlgContext, useSetLoginFlgContext } from './LoginFlgContext';
import { useCustomRouter } from './useCustomRouter';
import { useFetch } from '../hooks/useFetch';

export const useLogout = () => {
  // ページ遷移を管理するルーター
  const { redirectToIndexPage } = useCustomRouter()
  // APIと通信する関数を受け取る
  const { logoutToFrontendServer } = useFetch()
  // ログイン状態と更新関数をコンテキストから取得する 
  const loginFlg = useLoginFlgContext();
  const setLoginFlg = useSetLoginFlgContext()

  const logoutUser = async () => {
    /**
     * APIと通信して、HTTPステータスごとに適切な処理をする
     * @return {void}
    */

    try {
      // フロントエンドAPIと通信してレスポンスを受け取る
      let {httpStatus, statusText } = await logoutToFrontendServer()
      if(httpStatus == 200){
        // ログアウトに成功した場合、ログイン状態を更新してリダイレクト
        setLoginFlg(() => false)
        redirectToIndexPage()
      } else if([401].includes(httpStatus)) {
        /**
         * 401: 認証エラー
         *  */
        console.error(`httpStatus: ${httpStatus}, statusText: ${statusText}`)
      }
    } 
    catch (error) {
      // 予期せぬエラーの場合
      console.error('Logout error:', error)
      //未実装
    }
  };

  return {
    loginFlg,
    logoutUser,
  };
}