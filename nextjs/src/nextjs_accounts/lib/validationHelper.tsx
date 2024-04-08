export const checkUserName = (userName:string)=>{
  const strSize:number = userName.length 
  let Validations:string[] = []

  if (strSize==0) Validations.push("ユーザーネームを入力してください")
  if (strSize>15) Validations.push("ユーザーネームが長すぎます")

  return Validations
}

export const checkEmail = (email:string)=>{
  const strSize:number = email.length 
  let Validations:string[] = []

  if(strSize==0) Validations.push("メールアドレスを入力してください")
  
  return Validations
}

export const checkPassword = (password:string)=>{
  const strSize:number = password.length
  let Validations:string[] = []

  if(strSize==0) Validations.push("パスワードを入力してください")
  
  return Validations
}