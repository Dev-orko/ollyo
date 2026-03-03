import Button from './Button';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl p-6 mx-4 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title || 'Confirm Action'}</h3>
        <p className="text-sm text-gray-600 mb-6">{message || 'Are you sure? This action cannot be undone.'}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
