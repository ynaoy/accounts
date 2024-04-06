import { checkUserName, checkEmail, checkPassword } from "../../lib/validationHelper";

describe("validationHelper", ()=>{
  
  test("ユーザーネームが空の場合のバリデーションのテスト", () => {
    const validationUserName = checkUserName("")
    expect(validationUserName).toBe("ユーザーネームを入力してください");
  })

  test("ユーザーネームが長すぎる場合のバリデーションのテスト", () => {
    const validationUserName = checkUserName("aaaaaaaaaaaaaaaa")
    expect(validationUserName).toBe("ユーザーネームが長すぎます");
  })

  test("メールアドレスが空の場合のバリデーションのテスト", () => {
    const validationEmail = checkEmail("")
    expect(validationEmail).toBe("メールアドレスを入力してください");
  })

  test("パスワードが空の場合のバリデーションのテスト", () => {
    const validationPassword = checkPassword("")
    expect(validationPassword).toBe("パスワードを入力してください");
  })
})