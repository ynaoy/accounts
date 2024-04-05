export type fetchParamsType = {
  method: 'GET'|'POST'|'PATCH'|'DELETE',
  headers: {[key:string]:string},
  credentials?:RequestCredentials,
  body?:string,
}
export type fetchLoginFlgReturnType = ()=>Promise<{loginFlg:boolean}>

export type postToSignupApiParamsType = {
  username: string;
  email: string;
  password: string;
}
export type postToSignupApiReturnType = (params:postToSignupApiParamsType)=>Promise<{loginFlg:boolean}>