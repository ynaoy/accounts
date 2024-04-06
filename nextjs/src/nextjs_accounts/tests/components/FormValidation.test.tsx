import { render, screen } from "@testing-library/react";
import FormValidation from "../../components/forms/FormValidation"

describe("FormValidation", ()=>{

  test('エラーメッセージが表示されていない場合にバリデーションが表示されていない', () => {
    //レンダー
    const { container } = render(<FormValidation />)
    //エラーメッセージが表示されていない
    const pTags = container.querySelectorAll('p')
    expect(pTags.length).toBe(0)
  });

  test('エラーメッセージが表示されている場合にバリデーションが表示されている',()=>{
    //レンダー
    const { container } = render(<FormValidation errorMessage="入力が不正です" />)
    //エラーメッセージが表示されている
    const pTags = container.querySelectorAll('p')
    expect(pTags.length).not.toBe(0)
    expect(screen.getByText("入力が不正です")).toBeTruthy()
  })
})