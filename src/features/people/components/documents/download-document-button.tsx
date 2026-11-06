import { DownloadSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { getApiErrorMessage } from '../../../../lib/http'
import { notify } from '../../../../lib/toast'
import { peopleApi } from '../../api/people-api'

const EXTENSIONS: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/csv': 'csv',
  'text/plain': 'txt',
  'image/png': 'png',
  'image/jpeg': 'jpg',
}

// The API's CORS setup doesn't expose Content-Disposition to the browser, so
// the real file name is often unreadable. The display name ("Offer Letter")
// then gets an extension from the file's type, so the OS can open it.
function withExtension(name: string, mimeType: string): string {
  const extension = EXTENSIONS[mimeType.split(';')[0].trim().toLowerCase()]
  return extension && !name.toLowerCase().endsWith(`.${extension}`) ? `${name}.${extension}` : name
}

// Fetches the file with the session cookie, then hands it to the browser as a download.
export function DownloadDocumentButton({ documentId, name }: { documentId: string; name: string }) {
  const [downloading, setDownloading] = useState(false)

  const download = async () => {
    setDownloading(true)
    try {
      const { blob, fileName } = await peopleApi.downloadDocument(documentId)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName ?? withExtension(name, blob.type)
      link.click()
      // Give the browser a moment to start the download before releasing the blob.
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      notify.error(`Couldn't download ${name}`, getApiErrorMessage(err))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={downloading}
      aria-label={`Download ${name}`}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-50"
    >
      <DownloadSimpleIcon className={`h-4 w-4 ${downloading ? 'animate-pulse' : ''}`} />
    </button>
  )
}
