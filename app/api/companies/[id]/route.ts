import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { verifyAccessToken } from '@/lib/utils/jwt'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const user = await verifyAccessToken(accessToken)

    if (!user) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    let query = supabase
      .from('companies')
      .select(`
        id,
        user_id,
        business_number,
        company_name,
        ceo_name,
        establishment_date,
        postcode,
        address,
        address_detail,
        manager_name,
        manager_position,
        manager_phone,
        manager_email,
        website,
        logo_url,
        intro_title,
        intro_content,
        equipment,
        materials,
        trl_level,
        certifications,
        industries,
        project_title,
        achievements,
        partners,
        video_url,
        lead_time,
        as_info,
        pricing_type,
        brand_color,
        is_verified,
        is_featured,
        view_count,
        created_at,
        updated_at,
        company_images(id, image_url, image_type, display_order),
        company_categories(category_id, categories(id, parent_id, category_name)),
        company_regions(region_id, regions(id, region_name, region_type))
      `)
      .eq('id', id)

    if (!user.isAdmin) {
      query = query.eq('user_id', user.userId)
    }

    const { data, error } = await query.single()

    if (error) {
      console.error('Company fetch error:', error)
      return NextResponse.json(
        { success: false, error: '기업 정보 조회에 실패했습니다.' },
        { status: 404 }
      )
    }

    const parentCategory = data.company_categories?.find(
      (cc: any) => cc.categories?.parent_id === null
    )?.category_id

    const countries = data.company_regions
      ?.filter((cr: any) => cr.regions?.region_type === 'country')
      .map((cr: any) => cr.regions?.region_name)
      .filter(Boolean) || []

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        parent_category: parentCategory || null,
        countries,
      },
    })
  } catch (error) {
    console.error('Company fetch error:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const user = await verifyAccessToken(accessToken)

    if (!user) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const supabase = await createClient()

    const fullAddress = body.address
      ? body.address_detail
        ? `${body.address} ${body.address_detail}`
        : body.address
      : null

    let updateQuery = supabase
      .from('companies')
      .update({
        company_name: body.company_name,
        business_number: body.business_number,
        intro_title: body.intro_title,
        ceo_name: body.ceo_name,
        manager_name: body.manager_name,
        manager_phone: body.manager_phone,
        manager_email: body.manager_email,
        website: body.website,
        postcode: body.postcode || null,
        address: fullAddress,
        address_detail: body.address_detail || null,
        equipment: body.equipment_list,
        materials: body.materials,
        trl_level: body.trl_level,
        certifications: body.certifications,
        industries: body.industries,
        project_title: body.project_title,
        achievements: body.achievements,
        partners: body.partners,
        video_url: body.video_url,
        lead_time: body.lead_time,
        as_info: body.as_info,
        pricing_type: body.pricing_type,
        brand_color: body.brand_color,
      })
      .eq('id', id)

    if (!user.isAdmin) {
      updateQuery = updateQuery.eq('user_id', user.userId)
    }

    const { data: company, error } = await updateQuery.select().single()

    if (error) {
      console.error('Company update error:', error)
      return NextResponse.json(
        { success: false, error: '기업 정보 수정에 실패했습니다.' },
        { status: 500 }
      )
    }

    await supabase.from('company_images').delete().eq('company_id', id)
    await supabase.from('company_categories').delete().eq('company_id', id)
    await supabase.from('company_regions').delete().eq('company_id', id)

    if (body.images && body.images.length > 0) {
      const imageInserts = body.images.map((url: string, index: number) => ({
        company_id: id,
        image_url: url,
        image_type: 'portfolio' as const,
        display_order: index,
      }))

      await supabase.from('company_images').insert(imageInserts)
    }

    const categoryIds: string[] = []

    if (body.parent_category) {
      categoryIds.push(body.parent_category)
    }

    if (body.category_ids && body.category_ids.length > 0) {
      categoryIds.push(...body.category_ids)
    }

    if (categoryIds.length > 0) {
      const categoryInserts = categoryIds.map((catId: string) => ({
        company_id: id,
        category_id: catId,
      }))

      await supabase.from('company_categories').insert(categoryInserts)
    }

    if (body.countries && body.countries.length > 0) {
      const { data: regions } = await supabase
        .from('regions')
        .select('id, region_name')
        .eq('region_type', 'country')
        .in('region_name', body.countries)

      if (regions && regions.length > 0) {
        const regionMap = new Map(
          regions.map((r) => [r.region_name, r.id])
        )

        const countryInserts = body.countries
          .filter((country: string) => regionMap.has(country))
          .map((country: string) => ({
            company_id: id,
            region_id: regionMap.get(country),
            region_type: 'country' as const,
          }))

        if (countryInserts.length > 0) {
          await supabase.from('company_regions').insert(countryInserts)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: '기업 정보가 수정되었습니다.',
      data: company,
    })
  } catch (error) {
    console.error('Company update error:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const user = await verifyAccessToken(accessToken)

    if (!user) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)
      .eq('user_id', user.userId)

    if (error) {
      console.error('Company delete error:', error)
      return NextResponse.json(
        { success: false, error: '기업 정보 삭제에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '기업 정보가 삭제되었습니다.',
    })
  } catch (error) {
    console.error('Company delete error:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

