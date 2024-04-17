import { useEffect } from 'react';
import { useLogin } from '../hooks/useLogin';
import { useCustomRouter } from '../hooks/useCustomRouter';
import Form from './forms/Form';
import FormItem from './forms/FormItem';
import FormValidation from './forms/FormValidation';

export default function LoginComponent(){
  const { loginFlg, formDispatch, validationStates, loginUser } = useLogin()
  const { redirectToIndexPage } = useCustomRouter()

  // 既にログイン済みならインデックスページにリダイレクトする 
  useEffect(() => {
    if(loginFlg) redirectToIndexPage()
  },[loginFlg]);

  const handleLogin = async() => {
    // ログインボタンがクリックされた時の処理
    loginUser()
  };

  return (
    <>
    <section className="bg-gray-50 dark:bg-gray-900 w-full y-full">
      <div className="flex flex-col items-center justify-center px-60 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 
                        dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                ログイン
            </h1>
            <Form onClick={()=>handleLogin()}
                  buttonText = "ログイン">
              <FormItem onChange={(e)=>formDispatch({type: "edited_email", email: e.target.value})} 
                id="email" type="email" labelText="メールアドレス" >
                { validationStates["emailValidations"].map((errorMessage, index)=>
                  <FormValidation key={index} errorMessage={errorMessage}/>
                )}
              </FormItem>

              <FormItem onChange={(e)=>formDispatch({type: "edited_password", password: e.target.value})} 
                id="password" type="password" labelText="パスワード" >
                { validationStates["passwordValidations"].map((errorMessage, index)=>
                  <FormValidation key={index} errorMessage={errorMessage}/>
                )}
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    </section>
  </>
  )
}