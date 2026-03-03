import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrud } from '../../hooks/useCrud';
import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import SearchFilter from '../../components/ui/SearchFilter';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import dayjs from 'dayjs';

const TYPE_COLORS = {
  ALLERGEN: 'red',
  AUDIT: 'blue',
  DOCUMENT: 'gray',
  FEEDBACK: 'yellow',
  NON_CONFORMANCE: 'orange',
  RISK: 'purple',
  TRAINING: 'indigo',
  RECALL: 'red',
};

export default function ComplianceLogListPage() {
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, limit: 20, search: '', type: '' });
  const [deleteId, setDeleteId] = useState(null);

  const { useList, useDelete } = useCrud('complianceLogs', '/compliance-logs');
  const { data, isLoading } = useList(params);
  const deleteMutation = useDelete();

  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (row) => <Badge color={TYPE_COLORS[row.type]}>{row.type.replace('_', ' ')}</Badge>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (row) => (
        <span className="block max-w-xs truncate" title={row.description}>
          {row.description}
        </span>
      ),
    },
    {
      key: 'createdBy',
      label: 'Created By',
      render: (row) => row.createdBy?.name || '-',
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => dayjs(row.createdAt).format('MMM D, YYYY HH:mm'),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/compliance-logs/${row.id}/edit`)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteId(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filters = [
    {
      key: 'type',
      label: 'All Types',
      options: [
        { value: 'ALLERGEN', label: 'Allergen' },
        { value: 'AUDIT', label: 'Audit' },
        { value: 'DOCUMENT', label: 'Document' },
        { value: 'FEEDBACK', label: 'Feedback' },
        { value: 'NON_CONFORMANCE', label: 'Non-Conformance' },
        { value: 'RISK', label: 'Risk' },
        { value: 'TRAINING', label: 'Training' },
        { value: 'RECALL', label: 'Recall' },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Compliance Logs</h2>
        <Button onClick={() => navigate('/compliance-logs/new')}>
          <Plus className="h-4 w-4 mr-1" /> Add Log
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4">
          <SearchFilter
            placeholder="Search compliance logs..."
            onSearch={(search) => setParams((p) => ({ ...p, search, page: 1 }))}
            filters={filters}
            onFilterChange={(key, value) => setParams((p) => ({ ...p, [key]: value, page: 1 }))}
          />
        </div>
        <DataTable
          columns={columns}
          data={data?.data}
          loading={isLoading}
          onRowClick={(row) => navigate(`/compliance-logs/${row.id}/edit`)}
        />
        <Pagination
          meta={data?.meta}
          onPageChange={(page) => setParams((p) => ({ ...p, page }))}
        />
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
        }}
        loading={deleteMutation.isPending}
        title="Delete Compliance Log"
        message="Are you sure you want to delete this compliance log?"
      />
    </div>
  );
}
