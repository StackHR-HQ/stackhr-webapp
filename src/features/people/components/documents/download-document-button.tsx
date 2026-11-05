import { DownloadSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { downloadBlob } from '../../../../lib/download'
import { getApiErrorMessage } from '../../../../lib/http'
import { notify } from '../../../../lib/toast'
import { peopleApi } from '../../api/people-api'

// Fetches the file with the session cookie, then hands it to the browser as a download.
export function DownloadDocumentButton({ documentId, name }: { documentId: string; name: string }) {
  const [downloading, setDownloading] = useState(false)

  const download = async () => {
    setDownloading(true)
    try {
      const { blob, fileName } = await peopleApi.downloadDocument(documentId)
      downloadBlob(blob, fileName ?? name)
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
