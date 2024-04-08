import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormItem from "../../components/forms/FormItem"
import FormValidation from "../../components/forms/FormValidation"

const onChangeMock = jest.fn()
describe("FormItem", ()=>{
  test("フォームが存在するかテスト", () => {
    //レンダー
    render(<FormItem onChange={onChangeMock} id="test" type="text" labelText="テスト" />);

    //labelTextが表示されている
    expect(screen.getByLabelText("テスト")).toBeTruthy()
    
    //フォームのtype属性が適応されている
    expect(screen.getByRole("textbox")).toBeTruthy()
  });

  test('フォームに入力があった場合にonChangeが呼び出される',async()=>{
    //レンダー
    render(<FormItem onChange={onChangeMock} id="test" type="text" labelText="テスト" />);
    
    //ユーザーイベントの初期化
    const user = userEvent.setup();
    
    //フォームに値を入力
    const form:HTMLInputElement = screen.getByRole('textbox') //通常getByRoleではHTMLElement型を受け取るがここではinputノードを扱うため型を指定
    await user.type(form, "テストインパット");
    
    //フォームに値が入力されている
    expect(form.value).toBe("テストインパット")
    
    //onChangeイベントが発火している
    expect(onChangeMock).toHaveBeenCalled()
  })

  test('チルドレンが表示されている',async()=>{
    //レンダー
    render(
      <FormItem onChange={onChangeMock} id="test" type="text" labelText="テスト">
        <FormValidation errorMessage="入力が不正です" />
      </FormItem>
    )
    //エラーメッセージが表示されている
    expect(screen.getByText("入力が不正です")).toBeTruthy()
  })
})