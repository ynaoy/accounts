import { useReducer } from 'react';
import { useLoginFlgContext, useSetLoginFlgContext } from './LoginFlgContext';
import { initialState as formInitialState, useFormReducer } from './useFormReducer';
import { initialState as validationInitialState, useFormValidationReducer,
         checkUserName, checkEmail, checkPassword } from './useFormValidationReducer';
import { useCustomRouter } from './useCustomRouter';
import { useFetch  } from '../hooks/useFetch';

export const useSignup = () => {
  // ページ遷移を管理するルーター
  const { redirectToIndexPage } = useCustomRouter()
  // APIと通信する関数を受け取る
  const { SignupToBackendServer } = useFetch()
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
      userNameValidations: checkUserName(formState['userName']),
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

  const registerUser = async () => {
    /**
     * フォームのサブミットボタンが押された時に、バリデーションをチェックしてAPIと通信する
     * @return {void}
    */

    if (!validateForm()) return;
    try {
      // バックエンドAPIにフォームをPOSTしてレスポンスを受け取る
      let {httpStatus, statusText, data } = await SignupToBackendServer(
        { 'username': formState['userName'], // バックエンドではparamsのキーがuser"N"ameではなくuser"n"ame
          'email': formState['email'],
          'password': formState['password'],
        })
      if(httpStatus == 201){
        // 無事ユーザーが作成された場合、ログイン状態を更新してリダイレクト
        setLoginFlg(() => true)
        redirectToIndexPage()
      } else if([400,409].includes(httpStatus)) {
        // バックエンドAPIのバリデーションが通らなかった場合、バリデーションの状態を更新する
        validationDispatch({ 
          type:'update_state',
          userNameValidations: data['username'] || [],
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
      console.error('Signup error:', error)
      //未実装
    }
  };

  return {
    loginFlg,
    formState,
    formDispatch,
    validationStates,
    registerUser,
  };
}
