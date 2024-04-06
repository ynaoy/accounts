import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormItem from "../../components/forms/FormItem"

const onChangeMock = jest.fn()
describe("FormItem", ()=>{
  test("フォームが存在するかテスト", () => {
    //レンダー
    render(<FormItem onChange={onChangeMock} id="test" type="text" labelText="テスト" ></FormItem>);

    //labelTextが表示されている
    expect(screen.getByLabelText("テスト")).toBeTruthy()
    
    //フォームのtype属性が適応されている
    expect(screen.getByRole("textbox")).toBeTruthy()
  });

  test('フォームに入力があった時にonChangeが呼び出される',async()=>{
    //レンダー
    render(<FormItem onChange={onChangeMock} id="test" type="text" labelText="テスト" ></FormItem>);
    
    //フォームに値を入力
    const form = screen.getByRole('textbox')
    await userEvent.type(form, "テストインパット");
    
    //フォームに値が入力されている
    expect(form.value).toBe("テストインパット")
    
    //onChangeイベントが発火している
    expect(onChangeMock).toHaveBeenCalled()
  })
})