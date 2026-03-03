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

const STATUS_COLORS = { ACTIVE: 'green', INACTIVE: 'gray' };

export default function ProductListPage() {
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, limit: 20, search: '', status: '' });
  const [deleteId, setDeleteId] = useState(null);

  const { useList, useDelete } = useCrud('products', '/products');
  const { data, isLoading } = useList(params);
  const deleteMutation = useDelete();

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (row) => row.supplier?.name || '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge color={STATUS_COLORS[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/products/${row.id}/edit`)}>
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
      key: 'status',
      label: 'All Statuses',
      options: [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <Button onClick={() => navigate('/products/new')}>
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4">
          <SearchFilter
            placeholder="Search products..."
            onSearch={(search) => setParams((p) => ({ ...p, search, page: 1 }))}
            filters={filters}
            onFilterChange={(key, value) => setParams((p) => ({ ...p, [key]: value, page: 1 }))}
          />
        </div>
        <DataTable
          columns={columns}
          data={data?.data}
          loading={isLoading}
          onRowClick={(row) => navigate(`/products/${row.id}/edit`)}
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
        title="Delete Product"
        message="Are you sure you want to delete this product?"
      />
    </div>
  );
}
