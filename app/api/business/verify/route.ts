import { NextRequest, NextResponse } from 'next/server'
import { verifyBusinessNumber, type BusinessVerificationOptions } from '@/lib/utils/business-verification'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessNumber, options } = body as {
      businessNumber: string
      options?: BusinessVerificationOptions
    }

    if (!businessNumber) {
      return NextResponse.json(
        { success: false, error: '사업자등록번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    const cleanedNumber = businessNumber.replace(/-/g, '')
    
    if (cleanedNumber.length !== 10 || !/^\d{10}$/.test(cleanedNumber)) {
      return NextResponse.json(
        { success: false, error: '사업자등록번호는 10자리 숫자여야 합니다.' },
        { status: 400 }
      )
    }

    console.log('Verifying business number:', cleanedNumber)
    
    const result = await verifyBusinessNumber(cleanedNumber, options)

    console.log('Verification result:', {
      isValid: result.isValid,
      message: result.message,
      hasData: !!result.data,
    })

    if (!result.isValid) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    })
  } catch (error) {
    console.error('Business verification API error:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack)
    }
    return NextResponse.json(
      { success: false, error: '사업자등록번호 검증 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

