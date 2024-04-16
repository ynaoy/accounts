import {  fetchLoginFlgReturnType, fetchParamsType, 
  postToSignupApiParamsType, postToSignupApiReturnType,
  postToLoginApiParamsType, postToLoginApiReturnType } from './types/useFetch.d'
import { getCookie } from 'cookies-next';

const fetchResponseFromApi = async( url:string, 
                                    params:fetchParamsType, 
                                    data: Record<string, unknown> = {}) =>{
  /**
   * APIと通信する基本的な関数
   * @return { Response }
  */

  // クッキーを取得
  const auth = getCookie('Authorization'); // 存在しなければundefined
  if(auth!=undefined){
    params.headers['Authorization'] = auth
  }

  // Json形式でリクエストをする
  params.headers['Content-Type'] = 'application/json';

  // GETメソッド時以外の時はパラメータをbodyに貼り付ける
  if(params.method!='GET'){
    params.body = JSON.stringify(data);
  }
  // APIにリクエストを送ってレスポンスをもらう
  let response = await fetch(url, params)
  return response
}

export const useFetch = ()=> {

  const fetchLoginFlg:fetchLoginFlgReturnType =async()=>{
    /**
     * 外部APIにリクエストを送ってからログイン状態を受け取る 
     * @return {boolean} - ログイン状態を返す
    */
  
    // APIにリクエストを送る
    try{
      const response = await fetchResponseFromApi(
        `${process.env.NEXT_PUBLIC_API_ORIGIN}/api/is_login`,
        { method:'GET', headers: {}, credentials: 'include',} 
      )
      return await response.json()// { loginFlg: {boolean}}
  
    } catch(error) {
      console.error(error);
      return {loginFlg: false}
    }
  }

  const postToSignupApi:postToSignupApiReturnType =async(data: postToSignupApiParamsType)=>{
    /**
     * 外部APIのSignupパスにPOSTメソッドでリクエストを送る
     * @return {httpStatus: number, statusText: string, data: {[key:string]: string[]}}
    */
    
    // APIにリクエストを送る
    try{
      const response = await fetchResponseFromApi(
      `${process.env.NEXT_PUBLIC_API_ORIGIN}/api/signup/`,
      { method:'POST', headers: {}, credentials: 'include', },
      data)

      //jsonを解凍してリターン 
      let ret = await response.json()
      console.log(ret)
      return {
        httpStatus: response.status,
        statusText: response.statusText,
        data: ret
      }    
    } catch(error) {
      console.error('Undefind Error:', error);
      return { 
        // 汎用的なエラーレスポンスを返す
        httpStatus: 500,
        statusText: 'Internal Server Error',
        data: { message: '予期せぬエラーが発生しました' },
      };
    }
  }

  const postToLoginApi:postToLoginApiReturnType =async(data: postToLoginApiParamsType)=>{
    /**
     * 外部APIのloginパスにPOSTメソッドでリクエストを送る
     * @return {httpStatus: number, statusText: string, data: {[key:string]: string[]}}
    */
    
    // APIにリクエストを送る
    try{
      const response = await fetchResponseFromApi(
      `${process.env.NEXT_PUBLIC_API_ORIGIN}/api/login/`,
      { method:'POST', headers: {}, credentials: 'include', },
      data)

      //jsonを解凍してリターン 
      let ret = await response.json()
      console.log(ret)
      return {
        httpStatus: response.status,
        statusText: response.statusText,
        data: ret
      }    
    } catch(error) {
      console.error('Undefind Error:', error);
      return { 
        // 汎用的なエラーレスポンスを返す
        httpStatus: 500,
        statusText: 'Internal Server Error',
        data: { message: '予期せぬエラーが発生しました' },
      };
    }
  }

  return{
    fetchLoginFlg,
    postToSignupApi,
    postToLoginApi
  }
}
