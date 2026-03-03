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

export default function SupplierListPage() {
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, limit: 20, search: '' });
  const [deleteId, setDeleteId] = useState(null);

  const { useList, useDelete } = useCrud('suppliers', '/suppliers');
  const { data, isLoading } = useList(params);
  const deleteMutation = useDelete();

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', render: (row) => row.email || '-' },
    { key: 'phone', label: 'Phone', render: (row) => row.phone || '-' },
    {
      key: '_count',
      label: 'Products',
      render: (row) => row._count?.products ?? 0,
    },
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
          <Button size="sm" variant="ghost" onClick={() => navigate(`/suppliers/${row.id}/edit`)}>
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
        <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
        <Button onClick={() => navigate('/suppliers/new')}>
          <Plus className="h-4 w-4 mr-1" /> Add Supplier
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4">
          <SearchFilter
            placeholder="Search suppliers..."
            onSearch={(search) => setParams((p) => ({ ...p, search, page: 1 }))}
          />
        </div>
        <DataTable
          columns={columns}
          data={data?.data}
          loading={isLoading}
          onRowClick={(row) => navigate(`/suppliers/${row.id}/edit`)}
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
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier? This action cannot be undone."
      />
    </div>
  );
}
