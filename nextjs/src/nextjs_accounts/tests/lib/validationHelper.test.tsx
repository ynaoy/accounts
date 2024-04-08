import { checkUserName, checkEmail, checkPassword } from "../../lib/validationHelper";

describe("validationHelper", ()=>{
  
  test("ユーザーネームが空の場合のバリデーションのテスト", () => {
    const validationUserName: string[] = checkUserName("")
    expect(validationUserName).toContain("ユーザーネームを入力してください");
  })

  test("ユーザーネームが長すぎる場合のバリデーションのテスト", () => {
    const validationUserName: string[] = checkUserName("aaaaaaaaaaaaaaaa")
    expect(validationUserName).toContain("ユーザーネームが長すぎます");
  })

  test("メールアドレスが空の場合のバリデーションのテスト", () => {
    const validationEmail: string[] = checkEmail("")
    expect(validationEmail).toContain("メールアドレスを入力してください");
  })

  test("パスワードが空の場合のバリデーションのテスト", () => {
    const validationPassword: string[] = checkPassword("")
    expect(validationPassword).toContain("パスワードを入力してください");
  })
})