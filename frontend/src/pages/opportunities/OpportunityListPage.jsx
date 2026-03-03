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

const STAGE_COLORS = { LEAD: 'blue', NEGOTIATION: 'yellow', WON: 'green', LOST: 'red' };

export default function OpportunityListPage() {
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, limit: 20, search: '', stage: '' });
  const [deleteId, setDeleteId] = useState(null);

  const { useList, useDelete } = useCrud('opportunities', '/opportunities');
  const { data, isLoading } = useList(params);
  const deleteMutation = useDelete();

  const columns = [
    {
      key: 'customer',
      label: 'Customer',
      render: (row) => row.customer?.name || '-',
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (row) => <Badge color={STAGE_COLORS[row.stage]}>{row.stage}</Badge>,
    },
    {
      key: 'value',
      label: 'Value',
      render: (row) => row.value != null ? `$${Number(row.value).toLocaleString()}` : '-',
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/opportunities/${row.id}/edit`)}>
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
      key: 'stage',
      label: 'All Stages',
      options: [
        { value: 'LEAD', label: 'Lead' },
        { value: 'NEGOTIATION', label: 'Negotiation' },
        { value: 'WON', label: 'Won' },
        { value: 'LOST', label: 'Lost' },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Opportunities</h2>
        <Button onClick={() => navigate('/opportunities/new')}>
          <Plus className="h-4 w-4 mr-1" /> Add Opportunity
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4">
          <SearchFilter
            placeholder="Search opportunities..."
            onSearch={(search) => setParams((p) => ({ ...p, search, page: 1 }))}
            filters={filters}
            onFilterChange={(key, value) => setParams((p) => ({ ...p, [key]: value, page: 1 }))}
          />
        </div>
        <DataTable
          columns={columns}
          data={data?.data}
          loading={isLoading}
          onRowClick={(row) => navigate(`/opportunities/${row.id}/edit`)}
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
        title="Delete Opportunity"
        message="Are you sure you want to delete this opportunity?"
      />
    </div>
  );
}
