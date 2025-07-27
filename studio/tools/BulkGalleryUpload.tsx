// /tools/BulkGalleryUpload.tsx

import {useState} from 'react'
import {useClient} from 'sanity'
import {Card, Text, Stack, Button, Spinner} from '@sanity/ui'
import {useDropzone} from 'react-dropzone'

export default function BulkGalleryUploadTool() {
  const client = useClient({apiVersion: '2023-01-01'})
  const [uploading, setUploading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const onDrop = async (acceptedFiles: File[]) => {
    setUploading(true)
    const newLogs: string[] = []

    for (const file of acceptedFiles) {
      if (!file.name.endsWith('.webp')) {
        newLogs.push(`❌ Skipped ${file.name} (not .webp)`)
        continue
      }

      // 🧠 Check for duplicate filename via originalFilename field
      const existing = await client.fetch(
        `*[_type == "galleryImage" && image.asset->originalFilename == $filename][0]`,
        {filename: file.name},
      )

      if (existing) {
        newLogs.push(`⚠️ Skipped ${file.name} (already uploaded)`)
        continue
      }

      try {
        const asset = await client.assets.upload('image', file, {
          filename: file.name,
          contentType: 'image/webp',
        })

        // Get alt text from filename (remove extension, replace dashes/underscores)
        const baseName = file.name.replace(/\.[^/.]+$/, '') // strip extension
        const readableAlt = baseName.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim()

        const doc = {
          _type: 'galleryImage',
          image: {asset: {_type: 'reference', _ref: asset._id}},
          alt: readableAlt.charAt(0).toUpperCase() + readableAlt.slice(1), // Capitalize
          caption: '',
          category: '',
        }

        const created = await client.create(doc)
        newLogs.push(`✅ Uploaded: ${file.name} → ${created._id}`)
      } catch (err: any) {
        newLogs.push(`❌ Error uploading ${file.name}: ${err.message}`)
      }
    }

    setLogs(newLogs)
    setUploading(false)
  }

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: {'image/webp': ['.webp']},
  })

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Card padding={3} tone="positive" border radius={2}>
          <Text weight="semibold">📤 Bulk Gallery Upload (.webp only)</Text>
        </Card>

        <Card
          padding={4}
          radius={2}
          shadow={1}
          tone="default"
          border
          {...getRootProps()}
          style={{cursor: 'pointer', textAlign: 'center', background: '#fafafa'}}
        >
          <input {...getInputProps()} />
          <Text>Drag & drop .webp files here, or click to select</Text>
        </Card>

        {uploading && (
          <Stack space={3} padding={3}>
            <Spinner muted />
            <Text>Uploading...</Text>
          </Stack>
        )}

        {logs.length > 0 && (
          <Card padding={3} tone="transparent">
            <Stack space={2}>
              {logs.map((log, i) => (
                <Text key={i} size={1}>
                  {log}
                </Text>
              ))}
            </Stack>
          </Card>
        )}
      </Stack>
    </Card>
  )
}
