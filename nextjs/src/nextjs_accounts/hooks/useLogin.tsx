import { useReducer } from 'react';
import { useLoginFlgContext, useSetLoginFlgContext } from './LoginFlgContext';
import { initialState as formInitialState, useFormReducer } from './useFormReducer';
import { initialState as validationInitialState, useFormValidationReducer,
         checkEmail, checkPassword } from './useFormValidationReducer';
import { useCustomRouter } from './useCustomRouter';
import { useFetch } from '../hooks/useFetch';

export const useLogin = () => {
  // ページ遷移を管理するルーター
  const { redirectToIndexPage } = useCustomRouter()
  // APIと通信する関数を受け取る
  const { loginToFrontendServer } = useFetch()
  // ログイン状態と更新関数をコンテキストから取得する 
  const loginFlg = useLoginFlgContext();
  const setLoginFlg = useSetLoginFlgContext()
  // フォームの状態を管理するリデューサ
  const [formState, formDispatch] = useReducer(useFormReducer, formInitialState)
  // バリデーションの状態を管理するリデューサ
  const [validationStates, validationDispatch] = useReducer(useFormValidationReducer, validationInitialState)

  const validateForm = () => {
    /**
     * 全てのバリデーションをチェック
     * @return {boolean}
     */

    // 各項目のバリデーションをチェックし、結果をオブジェクトに格納
    const validations = {
      ...validationStates,
      emailValidations: checkEmail(formState['email']),
      passwordValidations: checkPassword(formState['password']),
    };

    // 全てのバリデーションエラーを一次元にして、バリデーションが通ったか判定
    const allValidations = Object.values(validations).flat();
    const isValid = (allValidations.length == 0)
    // バリデーションの状態を更新
    validationDispatch({ 
      type: 'update_state',
      ...validations
    })
    return isValid
  }

  const loginUser = async () => {
    /**
     * フォームのサブミットボタンが押された時に、バリデーションをチェックしてAPIと通信する
     * @return {void}
    */

    if (!validateForm()) return;
    try {
      // バックエンドAPIにフォームをPOSTしてレスポンスを受け取る
      let {httpStatus, statusText, data } = await loginToFrontendServer(
        { 'email': formState['email'], 'password': formState['password'] })
      if(httpStatus == 200){
        // ログインに成功した場合、ログイン状態を更新してリダイレクト
        setLoginFlg(() => true)
        redirectToIndexPage()
      } else if([400,401,404].includes(httpStatus)) {
        /**
         * 400: バックエンドAPIのバリデーションエラー
         * 401: 認証エラー
         * 404: Userが存在しない
         *  */
        validationDispatch({ 
          type:'update_state',
          ...validationStates,
          emailValidations:    data['email'] || [],
          passwordValidations: data['password'] || [],
        })
      } else{
        // バックエンド側での予期せぬエラーの場合
        console.error(`httpStatus: ${httpStatus}, statusText: ${statusText}, data: ${data}`)
        //未実装
      }
    } 
    catch (error) {
      // フロントエンド側での予期せぬエラーの場合
      console.error('Login error:', error)
      //未実装
    }
  };

  return {
    loginFlg,
    formState,
    formDispatch,
    validationStates,
    loginUser,
  };
}
