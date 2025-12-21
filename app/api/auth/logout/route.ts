import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: '로그아웃되었습니다.',
    })

    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')

    return response
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '로그아웃 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
