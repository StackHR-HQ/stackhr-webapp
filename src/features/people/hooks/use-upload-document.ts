import { useMutation, useQueryClient } from '@tanstack/react-query'
import { peopleApi } from '../api/people-api'
import type { UploadDocumentPayload } from '../types/people-types'

export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UploadDocumentPayload) => peopleApi.uploadDocument(payload),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({
        queryKey: ['people', 'documents', result.scope === 'company' ? 'company' : 'employees'],
      })
      if (result.scope === 'employee' && 'employeeId' in result.document) {
        void queryClient.invalidateQueries({ queryKey: ['people', 'employees', result.document.employeeId] })
      }
    },
  })
}
