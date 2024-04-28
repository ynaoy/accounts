/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { useFetchOnServer } from '../../hooks/useFetchOnServer';

// Next.jsのcookiesモジュールのモック
let cookieMock = jest.fn().mockReturnValue('myCookie')
jest.mock("next/headers", () => ({
    ...jest.requireActual("next/headers"),
    cookies: ()=> { 
      return{ 
        get:(key:string)=> {
          return { value:cookieMock }
        }
      }},
  })
)

describe('useFetchOnServer', () => {
  beforeEach(() => {
    // モックのリセット
    global.fetch = jest.fn()
    cookieMock.mockClear()
  });

  afterEach(() => {
    // テスト後のクリーンアップ
    jest.restoreAllMocks();
  })

  test('fetchLoginFlgFromBackendServerメソッドでリクエストに成功した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText:"ok",
        json: () => Promise.resolve({loginFlg: true}),
      })
    )
    // useFetchOnServerの初期化
    const { result } = renderHook(() => useFetchOnServer());

    // fetchLoginFlgFromBackendServerを実行して結果をテスト
    let response = await result.current.fetchLoginFlgFromBackendServer()
    expect(response).toEqual({ httpStatus:200, statusText:"ok", data: {loginFlg: true} })
  })

  test('fetchLoginFlgFromBackendServerメソッドでリクエストに失敗した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    )
    // useFetchOnServerの初期化
    const { result } = renderHook(() => useFetchOnServer());

    // fetchLoginFlgFromBackendServerを実行して結果をテスト
    let response = await result.current.fetchLoginFlgFromBackendServer()
    expect(response).toEqual({ 
      httpStatus:500, 
      statusText:'Internal Server Error',
      data: {loginFlg: false, message: '予期せぬエラーが発生しました'}
    })
  })

  test('signupToBackendServerでリクエストに成功した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 201,
        statusText: 'OK',
        json: () => Promise.resolve({ message: 'Success' }),
        headers: { get: (key:string)=>'myCookie' }
      })
    );
    // useFetchOnServerの初期化
    const { result } = renderHook(() => useFetchOnServer());

    // signupToBackendServerを実行して結果をテスト
    let response = await result.current.signupToBackendServer({username: 'test', 
                                                                email:'testemail@examplecom', 
                                                                password: 'password' })
    expect(response).toEqual({ 
      json: { httpStatus: 201, statusText: 'OK', data: { message: 'Success' }},
      cookie:'myCookie',
    })
  })

  test('signupToBackendServerでリクエストに失敗した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })
    )
    // useFetchOnServerの初期化
    const { result } = renderHook(() => useFetchOnServer())

    // signupToBackendServerを実行して結果をテスト
    let response = await result.current.signupToBackendServer({ username: '', email:'', password: '' })
    expect(response).toEqual({ 
      json:{ httpStatus: 500, statusText: 'Internal Server Error', data: { message: '予期せぬエラーが発生しました' }},
      cookie: null
    })
  })

  test('loginToBackendServerでリクエストに成功した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: () => Promise.resolve({ message: 'Success' }),
        headers: { get: (key:string)=>'myCookie' }
      })
    );
    // useFetchOnServerの初期化
    const { result } = renderHook(() => useFetchOnServer());

    // loginToBackendServerを実行して結果をテスト
    let response = await result.current.loginToBackendServer({ email:'testemail@examplecom', 
                                                               password: 'password' })
    expect(response).toEqual({
      json:{ httpStatus: 200, statusText: 'OK', data: { message: 'Success' } },
      cookie: 'myCookie'
    })
  })
  
  test('loginToBackendServerでリクエストに失敗した際に、適切なオブジェクトが返されている', async () => {
    // fetchのモック
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })
    )
    // useFetchOnServerの初期化
    const { result } = renderHook(() => useFetchOnServer())

    // loginToBackendServerを実行して結果をテスト
    let response = await result.current.loginToBackendServer({ email:'', password: '' })
    expect(response).toEqual({ 
      json:{ httpStatus: 500, 
             statusText: 'Internal Server Error', 
             data: { message: '予期せぬエラーが発生しました' }},
      cookie: null
    })
  })
})
