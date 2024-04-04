import { render, screen, fireEvent} from "@testing-library/react";
import Form from "../../components/forms/Form"

const onClickMock = jest.fn()
describe("FormComponent", ()=>{

  afterEach(()=>{
    onClickMock.mockClear()
  })

  test("サブミットボタンが存在するかと子コンポーネントが表示されているテスト", () => {
    //レンダー
    render(<Form onClick={onClickMock} buttonText="登録">
            <div> チルドレン </div>
           </Form>);

    //サブミットボタンが存在する
    expect(screen.getByRole("button", {name: "登録"})).toBeTruthy()
    
    //子コンポーネントが表示されている
    expect(screen.getByText("チルドレン")).toBeTruthy()
  });

  test("サブミットボタンをクリックした時にonSubmitが呼び出される",()=>{
    //レンダー
    render(<Form onClick={onClickMock} buttonText="登録"/>);
    
    //サブミットボタンが存在する
    const button = screen.getByRole("button", {name: "登録"})
    expect(button).toBeTruthy()

    //サブミットボタンをクリック
    fireEvent.click(button)
    
    //onClickイベントが発火している
    expect(onClickMock).toHaveBeenCalled()
  })
})