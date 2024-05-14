/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { useUpdate } from '../../hooks/useUpdate'

// Next.jsのuseRouterモジュールのモック
let routerPushMock = jest.fn()
jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    useRouter: ()=> {return { push: routerPushMock }},
  })
)

//コンテキストのモック
const setLoginFlgMock = jest.fn().mockReturnValue(true)
jest.mock('../../hooks/LoginFlgContext',
  ()=>({...jest.requireActual('../../hooks/LoginFlgContext'),
    useLoginFlgContext : ()=>false,
    useSetLoginFlgContext : ()=>setLoginFlgMock
  })
)

const updateToFrontendServerMock = jest.fn().mockResolvedValue({ httpStatus: 200, statusText: "", data: {}})
//APIと通信するモジュールのモック
jest.mock('../../hooks/useFetch',
  ()=>({...jest.requireActual('../../hooks/useFetch'),
    useFetch: ()=>{
      return { updateToFrontendServer : async()=>updateToFrontendServerMock() }
    }
  })
)

describe('useUpdate', () => {

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('バリデーションが通らない時に、処理が中断されている',async()=>{
    const { result } = renderHook(() => useUpdate())
    // フォームに無効な値を入力してユーザー更新処理
    await act(() => {
      result.current.formDispatch({ type: 'edited_userName', userName: '' });
      result.current.formDispatch({ type: 'edited_email', email: '' });
    })
    await act(() => {
      result.current.updateUser(1);
    })
    // バリデーションが更新されている
    expect(result.current.validationStates.userNameValidations).toContain('ユーザーネームを入力してください')
    expect(result.current.validationStates.emailValidations).toContain('メールアドレスを入力してください')
    // バリデーションが通らずにAPIと通信する関数が呼び出されていない
    expect(updateToFrontendServerMock).not.toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  })

  test('ユーザー情報の更新に成功した時、APIと通信され、ログイン状態が更新されて、rooter.pushメソッドが実行される',async()=>{
    const { result } = renderHook(() => useUpdate())
    // フォームに妥当な値を入力してユーザー更新処理
    await act(() => {
      result.current.formDispatch({ type: 'edited_userName', userName: 'test' });
      result.current.formDispatch({ type: 'edited_email', email: 'testemail@example.com' });
    })
    await act(() => {
      result.current.updateUser(1);
    })
    // APIと通信する関数が呼び出されている
    expect(updateToFrontendServerMock).toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されている
    expect(setLoginFlgMock).toHaveBeenCalled()
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  })

  test('APIから409エラーが返ってきた時に、カスタムフックの持つバリデーションの値が更新される',async()=>{
    // APIから受け取る値を変更
    updateToFrontendServerMock.mockResolvedValue({ 
      httpStatus:409, 
      statusText:'',
      data: { username:['このユーザーネームは既に使用されています'],
              email: ['このメールアドレスは既に使用されています']}
    })
    const { result } = renderHook(() => useUpdate())
    // フォームに妥当な値を入力してユーザー更新処理
    await act(() => {
      result.current.formDispatch({ type: 'edited_userName', userName: 'test' });
      result.current.formDispatch({ type: 'edited_email', email: 'testemail@example.com' });
    })
    await act(() => {
      result.current.updateUser(1);
    })
    // バリデーションが更新されている
    expect(result.current.validationStates.userNameValidations).toContain('このユーザーネームは既に使用されています')
    expect(result.current.validationStates.emailValidations).toContain('このメールアドレスは既に使用されています')

    // APIと通信する関数が呼び出されている
    expect(updateToFrontendServerMock).toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  })
});