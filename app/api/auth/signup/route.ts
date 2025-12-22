import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { createClient } from '@/lib/supabase/server'
import type { SignUpRequest } from '@/lib/types/auth.types'
import { validateSignUpRequest } from '@/lib/validations/auth.validation'

const SALT_ROUNDS = 10

export async function POST(request: Request) {
  try {
    const body: SignUpRequest = await request.json()

    const validationErrors = validateSignUpRequest(body)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: validationErrors[0] },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', body.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS)

    const { error: userError } = await supabase.from('users').insert({
      email: body.email,
      password: hashedPassword,
      name: body.name,
      phone: body.phone || null,
      status: 'active',
      user_grade: 'basic',
    })

    if (userError) {
      console.error('User insert error:', userError)
      return NextResponse.json(
        { success: false, error: '회원 정보 저장에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '회원가입이 완료되었습니다.',
    })
  } catch (error) {
    console.error('SignUp error:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}


