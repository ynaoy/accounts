/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { useDestroy } from '../../hooks/useDestroy'

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

const destroyToFrontendServerMock = jest.fn().mockResolvedValue({ httpStatus: 200, statusText: "", data: {}})
//APIと通信するモジュールのモック
jest.mock('../../hooks/useFetch',
  ()=>({...jest.requireActual('../../hooks/useFetch'),
    useFetch: ()=>{
      return { destroyToFrontendServer : async()=>destroyToFrontendServerMock() }
    }
  })
)

describe('useDestroy', () => {

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('バリデーションが通らない時に、処理が中断されている',async()=>{
    const { result } = renderHook(() => useDestroy())
    // フォームに無効な値を入力してユーザー更新処理
    await act(() => {
      result.current.formDispatch({ type: 'edited_password', password: '' });
    })
    await act(() => {
      result.current.destroyUser(1);
    })
    // バリデーションが更新されている
    expect(result.current.validationStates.passwordValidations).toContain('パスワードを入力してください')
    // バリデーションが通らずにAPIと通信する関数が呼び出されていない
    expect(destroyToFrontendServerMock).not.toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  })

  test('ユーザーの削除に成功した時、APIと通信され、ログイン状態が更新されて、rooter.pushメソッドが実行される',async()=>{
    const { result } = renderHook(() => useDestroy())
    // フォームに妥当な値を入力してユーザー削除処理
    await act(() => {
      result.current.formDispatch({ type: 'edited_password', password: 'password' });
    })
    await act(() => {
      result.current.destroyUser(1);
    })
    // APIと通信する関数が呼び出されている
    expect(destroyToFrontendServerMock).toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されている
    expect(setLoginFlgMock).toHaveBeenCalled()
    // router.pushメソッドが呼び出されている
    expect(routerPushMock).toHaveBeenCalled()
  })

  test('APIから401エラーが返ってきた時に、カスタムフックの持つバリデーションの値が更新される',async()=>{
    // APIから受け取る値を変更
    destroyToFrontendServerMock.mockResolvedValue({ 
      httpStatus:401, 
      statusText:'',
      data: { password:['パスワードが間違っています'] }
    })
    const { result } = renderHook(() => useDestroy())
    // フォームに妥当な値を入力してユーザー更新処理
    await act(() => {
      result.current.formDispatch({ type: 'edited_password', password: 'password' });
    })
    await act(() => {
      result.current.destroyUser(1);
    })
    // バリデーションが更新されている
    expect(result.current.validationStates.passwordValidations).toContain('パスワードが間違っています')

    // APIと通信する関数が呼び出されている
    expect(destroyToFrontendServerMock).toHaveBeenCalled()
    // ログイン状態を変更する関数が呼び出されていない
    expect(setLoginFlgMock).not.toHaveBeenCalled()
    // router.pushメソッドが呼び出されていない
    expect(routerPushMock).not.toHaveBeenCalled()
  })
});