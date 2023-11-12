import { useReducer } from 'react';
import { useLoginFlgContext, useSetLoginFlgContext } from '../hooks/LoginFlgContext';
import { initialState, userFormReducer } from '../hooks/userFormReducer';
import Form from './forms/Form';
import FormItem from './forms/FormItem';

export default function SignupComponent(){
  // ログイン状態と更新関数を取得する 
  const loginFlg = useLoginFlgContext();
  const setLoginFlg = useSetLoginFlgContext()

  // フォームの状態を管理する関数
  const [, dispatch] = useReducer(userFormReducer, initialState)

  const handleSignup = () => {
    // ユーザー登録ボタンがクリックされた時の処理
    setLoginFlg(() => !loginFlg);
  };

  return (
    <>
    <section className="bg-gray-50 dark:bg-gray-900 w-full y-full">
      <div className="flex flex-col items-center justify-center px-60 mx-auto md:h-screen lg:py-0">
        <div className="w-full h-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 
                        dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                ユーザー登録
            </h1>
            <Form onClick={()=>handleSignup()}
                  buttonText = "登録">
              <FormItem onChange={(e)=>dispatch({type: 'edited_userName',userName: e.target.value})} 
                id="userName" type="text" labelText="ユーザーネーム"/>
              <FormItem onChange={(e)=>dispatch({type: 'edited_email',email: e.target.value})} 
                id="email" type="email" labelText="メールアドレス"/>
              <FormItem onChange={(e)=>dispatch({type: 'edited_password',password: e.target.value})} 
                id="password" type="password" labelText="パスワード"/>
            </Form>
          </div>
        </div>
      </div>
    </section>
  </>
  )
}