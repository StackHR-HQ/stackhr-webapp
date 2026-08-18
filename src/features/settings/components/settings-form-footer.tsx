import { Button } from '../../../components/ui/button'

export function SettingsFormFooter({ isPending, isSuccess }: { isPending: boolean; isSuccess: boolean }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      {isSuccess && !isPending ? (
        <span className="text-xs font-medium text-positive" role="status">
          Saved
        </span>
      ) : null}
      <Button type="submit" loading={isPending} className="w-auto px-6">
        Save changes
      </Button>
    </div>
  )
}
