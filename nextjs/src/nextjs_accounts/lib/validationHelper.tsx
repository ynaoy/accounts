export const checkUserName = (userName:string)=>{
  const strSize = userName.length 
  if (strSize==0) return "ユーザーネームを入力してください"
  if (strSize>15) return "ユーザーネームが長すぎます"
  return ""
}

export const checkEmail = (email:string)=>{
  const strSize = email.length 
  if(strSize==0) return "メールアドレスを入力してください"
  return ""
}

export const checkPassword = (password:string)=>{
  const strSize = password.length 
  if(strSize==0) return "パスワードを入力してください"
  return ""
}