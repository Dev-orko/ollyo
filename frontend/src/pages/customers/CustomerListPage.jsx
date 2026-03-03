import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrud } from '../../hooks/useCrud';
import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import Pagination from '../../components/ui/Pagination';
import SearchFilter from '../../components/ui/SearchFilter';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import dayjs from 'dayjs';

export default function CustomerListPage() {
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, limit: 20, search: '' });
  const [deleteId, setDeleteId] = useState(null);

  const { useList, useDelete } = useCrud('customers', '/customers');
  const { data, isLoading } = useList(params);
  const deleteMutation = useDelete();

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', render: (row) => row.email || '-' },
    { key: 'phone', label: 'Phone', render: (row) => row.phone || '-' },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => dayjs(row.createdAt).format('MMM D, YYYY'),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/customers/${row.id}/edit`)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteId(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <Button onClick={() => navigate('/customers/new')}>
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4">
          <SearchFilter
            placeholder="Search customers..."
            onSearch={(search) => setParams((p) => ({ ...p, search, page: 1 }))}
          />
        </div>
        <DataTable
          columns={columns}
          data={data?.data}
          loading={isLoading}
          onRowClick={(row) => navigate(`/customers/${row.id}/edit`)}
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
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
      />
    </div>
  );
}
