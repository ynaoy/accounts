import { useEffect, useState } from 'react';
import { useDestroy } from '../hooks/useDestroy';
import { useFetch } from '../hooks/useFetch';
import { useCustomRouter } from '../hooks/useCustomRouter';
import Form from './forms/Form';
import FormItem from './forms/FormItem';
import FormValidation from './forms/FormValidation';

export default function UpdateComponent(){
  const { loginFlg, formDispatch, validationStates, destroyUser } = useDestroy()
  const { fetchUserIdFromFrontendServer } = useFetch()
  const { redirectToIndexPage } = useCustomRouter()
  const [userId, setUserId] = useState(-1)

  // ログインしてないならインデックスページにリダイレクトする 
  useEffect(() => {
    if(!loginFlg) redirectToIndexPage();
  },[loginFlg, redirectToIndexPage]);

  // APIと通信してユーザーIDを取得する
  useEffect(() => {
    fetchData();
  },[]);

  const fetchData = async()=>{
    // レンダリング時にユーザーIDを取得する
    const{ data } = await fetchUserIdFromFrontendServer();
    const userId = data["userId"];
    if(userId) setUserId(userId);
  }

  const handleUpdate = async() => {
    // 更新ボタンがクリックされた時の処理
    if(userId>=0){ // ユーザーIDが取得できなかった時は -1
      destroyUser(userId)
    }else{
      console.error("ログインしてください")
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
                ユーザー削除
            </h1>
            <Form onClick={()=>handleUpdate()}
                  buttonText = "削除">
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