"use server"

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { useFetchOnServer } from '../../../../hooks/useFetchOnServer';

export async function DELETE(req: NextRequest, { params }:{ params: { userId: number }}){
  const userId = (params["userId"])? params["userId"]: -1
  const body = await req.json()
  // 外部APIと通信する関数を受け取る
  const { destroyToBackendServer } = useFetchOnServer()
  // 外部APIからログイン状態を受け取る
  const { json, cookie} = await destroyToBackendServer(body, userId)
  // クッキーとjsonオブジェクトをレスポンスにセットして返す
  const response = NextResponse.json(json)
  console.log(cookie)
  if(cookie) await response.headers.set('Set-Cookie', cookie);
  // ログイン情報を削除
  response.cookies.delete('Authorization')
  response.cookies.delete('refresh')
  return response
}