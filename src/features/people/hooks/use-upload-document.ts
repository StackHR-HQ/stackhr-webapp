import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { UploadDocumentPayload } from '../types/people-types'

export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UploadDocumentPayload) => peopleApi.uploadDocument(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['people', 'documents'] }),
  })
}
