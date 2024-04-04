export type fetchLoginFlgReturn = ()=>Promise<{loginFlg:boolean}>
export type fetchParams = {
  method: 'GET'|'POST'|'PATCH'|'DELETE',
  headers: {[key:string]:string},
  credentials?:RequestCredentials,
  body?:string,
}