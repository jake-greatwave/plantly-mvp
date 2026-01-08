import { createClient } from '@/lib/supabase/client'

export async function uploadFile(file: File, bucket: string = 'company-files'): Promise<string | null> {
  try {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (error) throw error

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}

export async function uploadMultipleFiles(files: File[], bucket: string = 'company-files'): Promise<string[]> {
  const uploadPromises = files.map(file => uploadFile(file, bucket))
  const results = await Promise.all(uploadPromises)
  return results.filter((url): url is string => url !== null)
}











