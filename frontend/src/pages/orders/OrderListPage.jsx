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

const STATUS_COLORS = { PENDING: 'yellow', COMPLETED: 'green', CANCELLED: 'red' };

export default function OrderListPage() {
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, limit: 20, search: '', status: '' });
  const [deleteId, setDeleteId] = useState(null);

  const { useList, useDelete } = useCrud('orders', '/orders');
  const { data, isLoading } = useList(params);
  const deleteMutation = useDelete();

  const columns = [
    {
      key: 'customer',
      label: 'Customer',
      render: (row) => row.customer?.name || '-',
    },
    {
      key: 'total',
      label: 'Total',
      render: (row) => `$${Number(row.total || 0).toFixed(2)}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge color={STATUS_COLORS[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'orderDate',
      label: 'Order Date',
      render: (row) => row.orderDate ? dayjs(row.orderDate).format('MMM D, YYYY') : '-',
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/orders/${row.id}/edit`)}>
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
        { value: 'PENDING', label: 'Pending' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <Button onClick={() => navigate('/orders/new')}>
          <Plus className="h-4 w-4 mr-1" /> New Order
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4">
          <SearchFilter
            placeholder="Search orders..."
            onSearch={(search) => setParams((p) => ({ ...p, search, page: 1 }))}
            filters={filters}
            onFilterChange={(key, value) => setParams((p) => ({ ...p, [key]: value, page: 1 }))}
          />
        </div>
        <DataTable
          columns={columns}
          data={data?.data}
          loading={isLoading}
          onRowClick={(row) => navigate(`/orders/${row.id}/edit`)}
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
        title="Delete Order"
        message="Are you sure you want to delete this order?"
      />
    </div>
  );
}
