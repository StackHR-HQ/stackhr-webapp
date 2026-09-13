import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { DocumentUploadPayload } from '../api/people-api'
import { peopleService } from '../api/people-service'

export function useUploadDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: DocumentUploadPayload) => peopleService.uploadDocument(payload),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({ queryKey: ['people', 'documents', result.scope === 'company' ? 'company' : 'employees'] })
      if (result.scope === 'employee' && 'employeeId' in result.document) {
        void queryClient.invalidateQueries({ queryKey: ['people', 'employees', result.document.employeeId] })
      }
    },
  })
}
