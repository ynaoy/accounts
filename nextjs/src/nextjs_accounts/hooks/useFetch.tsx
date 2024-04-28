import {  fetchLoginFlgReturnType, fetchParamsType, 
  signupParamsType, signupToFrontendServerReturnType,
  loginParamsType, loginToFrontendServerReturnType } from './types/useFetch.d'

export const fetchResponse = async( url:string, 
                                    params:fetchParamsType, 
                                    data: Record<string, unknown> = {}) =>{
  /**
   * APIと通信する基本的な関数
   * @return { Response }
  */

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

  const fetchLoginFlgFromFrontendServer:fetchLoginFlgReturnType =async()=>{
    /**
     * フロントエンドサーバーにリクエストを送って、ログイン状態を受け取る 
     * @return {httpStatus: number, statusText: string, data: {[key:string]: string[]}}
    */

    // フロントエンドサーバーにリクエストを送る
    try{
      const response = await fetchResponse(
        `${process.env.NEXT_PUBLIC_MY_ORIGIN}/api/login/check/`,
        { method:'GET', headers: {}, credentials: 'include',}
      )
      return await response.json()
  
    } catch(error) {
      console.error(error);
      return { data: {loginFlg: false, message: '予期せぬエラーが発生しました'}}
    }
  }

  const signupToFrontendServer:signupToFrontendServerReturnType =async(data: signupParamsType)=>{
    /**
     * フロントエンドサーバーにPOSTメソッドでリクエストを送る
     * @return {httpStatus: number, statusText: string, data: {[key:string]: string[]}}
    */
    
    // フロントエンドサーバーにリクエストを送る
    try{
      const response = await fetchResponse(
        `${process.env.NEXT_PUBLIC_MY_ORIGIN}/api/signup/`,
        { method:'POST', headers: {}, credentials: 'include', },
        data )
      return await response.json()

    } catch(error) {
      return { 
        // 汎用的なエラーレスポンスを返す
        httpStatus: 500,
        statusText: 'Internal Server Error',
        data: { message: '予期せぬエラーが発生しました' },
      };
    }
  }

  const loginToFrontendServer:loginToFrontendServerReturnType =async(data: loginParamsType)=>{
    /**
     * フロントエンドサーバーにPOSTメソッドでリクエストを送る
     * @return {httpStatus: number, statusText: string, data: {[key:string]: string[]}}
    */
    
    // APIにリクエストを送る
    try{
      const response = await fetchResponse(
        `${process.env.NEXT_PUBLIC_MY_ORIGIN}/api/login/`,
        { method:'POST', headers: {}, credentials: 'include', },
        data)
      return await response.json()
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
    fetchLoginFlgFromFrontendServer,
    signupToFrontendServer,
    loginToFrontendServer,
  }
}
