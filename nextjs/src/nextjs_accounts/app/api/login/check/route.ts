"use server"

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { useFetch } from '../../../../hooks/useFetch';

export async function GET(req: NextRequest){
  // 外部APIと通信する関数を受け取る
  const { fetchLoginFlg } = useFetch()
  // 外部APIからログイン状態を受け取る
  const { loginFlg } = await fetchLoginFlg()
  return NextResponse.json({ loginFlg: loginFlg })
}