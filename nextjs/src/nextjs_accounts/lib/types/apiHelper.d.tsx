export type fetchLoginFlgReturnType = ()=>Promise<{loginFlg:boolean}>
export type fetchParamsType = {
  method: 'GET'|'POST'|'PATCH'|'DELETE',
  headers: {[key:string]:string},
  credentials?:RequestCredentials,
  body?:string,
}
export type postToSignupApiParamsType = {
  userName: string;
  email: string;
  password: string;
}