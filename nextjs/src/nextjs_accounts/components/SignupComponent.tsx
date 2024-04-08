import { useReducer } from 'react';
import { useLoginFlgContext, useSetLoginFlgContext } from '../hooks/LoginFlgContext';
import { initialState as formInitialState, useFormReducer } from '../hooks/useFormReducer';
import { initialState as validationInitialState, useFormValidationReducer } from '../hooks/useFormValidationReducer';
import { postToSignupApi } from '../lib/apiHelper';
import { checkUserName, checkEmail, checkPassword } from "../lib/validationHelper";
import Form from './forms/Form';
import FormItem from './forms/FormItem';
import FormValidation from './forms/FormValidation';

export default function SignupComponent(){
  // ログイン状態と更新関数を取得する 
  const loginFlg = useLoginFlgContext();
  const setLoginFlg = useSetLoginFlgContext()

  // フォームの状態を管理する関数
  const [formState, formDispatch] = useReducer(useFormReducer, formInitialState)
  // バリデーションの状態を管理する関数
  const [validationStates, validationDispatch] = useReducer(useFormValidationReducer, validationInitialState)

  // APIと通信するか判定のため一時的にバリデーションの値を入れる変数
  let userNameValidations: string[] = []
  let emailValidations: string[] = []
  let passwordValidations: string[] = []

  const handleSignup = async() => {
    /**
     * ユーザー登録ボタンがクリックされた時の処理
    **/

    // 各項目のバリデーションをチェック
    userNameValidations = checkUserName(formState["userName"])
    emailValidations = checkEmail(formState["email"])
    passwordValidations = checkPassword(formState["password"])

    // バリデーション部分のUIの更新
    validationDispatch({ 
      type:'update_state',
      userNameValidations: userNameValidations,
      emailValidations: emailValidations,
      passwordValidations: passwordValidations
    })
    // バリデーションが全て空なら処理を続行
    if(!(!userNameValidations.length && !emailValidations.length && !passwordValidations.length)){
      return
    }

    // バックエンドApiにフォームをPOSTしてレスポンスを受け取る
    let {httpStatus, statusText, data} = await postToSignupApi(
      { 'username': formState['userName'], // バックエンドではparamsのキーがuser"N"ameではなくuser"n"ame
        'email': formState['email'],
        'password': formState['password'],
      })
    // 無事ユーザーが作成された場合
    if(httpStatus == 201){
      setLoginFlg(() => true);
    }
    // バックエンドのバリデーションが通らなかった場合
    else if(httpStatus == 400){
      console.log(`httpStatus: ${httpStatus}, statusText: ${statusText}, data: ${data}`)
      //未実装
    }
    // 重複するuserNameかemailのユーザーが存在する場合
    else if(httpStatus == 409){
      console.log(`httpStatus: ${httpStatus}, statusText: ${statusText}, data: ${data}`)
      //未実装
    }
    // 予期せぬエラーの場合
    else{
      console.log(`httpStatus: ${httpStatus}, statusText: ${statusText}, data: ${data}`)
      //未実装
    }
  };

  return (
    <>
    <section className="bg-gray-50 dark:bg-gray-900 w-full y-full">
      <div className="flex flex-col items-center justify-center px-60 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 
                        dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                ユーザー登録
            </h1>
            <Form onClick={()=>handleSignup()}
                  buttonText = "登録">
              <FormItem onChange={(e)=>formDispatch({type: "edited_userName", userName: e.target.value})} 
                id="username" type="text" labelText="ユーザーネーム" >
                { validationStates["userNameValidations"].map((errorMessage, index)=>
                  <FormValidation key={index} errorMessage={errorMessage}/>
                )}
              </FormItem>
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