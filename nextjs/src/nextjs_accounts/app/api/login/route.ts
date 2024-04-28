"use server"

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { useFetchOnServer } from '../../../hooks/useFetchOnServer';

export async function POST(req: NextRequest){
  const body = await req.json()
  // 外部APIと通信する関数を受け取る
  const { loginToBackendServer } = useFetchOnServer()
  // 外部APIからログイン状態を受け取る
  const { json, cookie} = await loginToBackendServer(body)
  // クッキーとjsonオブジェクトをレスポンスにセットして返す
  const response = NextResponse.json(json)
  if(cookie) await response.headers.set('Set-Cookie', cookie);
  return response
}