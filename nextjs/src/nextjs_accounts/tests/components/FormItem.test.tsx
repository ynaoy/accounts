import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormItem from "../../components/forms/FormItem"

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
    const form = screen.getByRole('textbox')
    await user.type(form, "テストインパット");
    
    //フォームに値が入力されている
    expect(form.value).toBe("テストインパット")
    
    //onChangeイベントが発火している
    expect(onChangeMock).toHaveBeenCalled()
  })

  test('エラーメッセージが空でない場合に表示されている',async()=>{
    //レンダー
    render(<FormItem onChange={onChangeMock} id="test" type="text" labelText="テスト" errorMessage="入力が不正です" />)
    //エラーメッセージが表示されている
    expect(screen.getByText("入力が不正です")).toBeTruthy()
  })
})