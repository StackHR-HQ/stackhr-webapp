// Hands a blob to the browser as a file download. The link is attached to the
// document because Firefox ignores clicks on detached links, and the URL is
// released a moment later so the download has time to start.
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Saves CSV text with a byte-order mark so Excel reads it as UTF-8 (names like
// "Adébáyọ̀" otherwise come out garbled).
export function downloadCsv(text: string, fileName: string) {
  downloadBlob(new Blob(['﻿', text], { type: 'text/csv;charset=utf-8' }), fileName)
}

// Quotes a CSV cell when it holds a comma, quote or line break, and stops
// spreadsheet apps from running text that starts like a formula.
export function csvCell(value: string | number): string {
  let text = String(value)
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
