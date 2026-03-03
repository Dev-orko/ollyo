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

const TYPE_COLORS = { HALAL: 'green', KOSHER: 'blue', ISO: 'purple', FSSC: 'indigo', OTHER: 'gray' };

export default function CertificationListPage() {
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, limit: 20, search: '', type: '', expiringSoon: '' });
  const [deleteId, setDeleteId] = useState(null);

  const { useList, useDelete } = useCrud('certifications', '/certifications');
  const { data, isLoading } = useList(params);
  const deleteMutation = useDelete();

  const isExpiringSoon = (dateStr) => {
    const diff = dayjs(dateStr).diff(dayjs(), 'day');
    return diff >= 0 && diff <= 30;
  };

  const columns = [
    {
      key: 'supplier',
      label: 'Supplier',
      render: (row) => row.supplier?.name || '-',
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => <Badge color={TYPE_COLORS[row.type]}>{row.type}</Badge>,
    },
    {
      key: 'issueDate',
      label: 'Issued',
      render: (row) => dayjs(row.issueDate).format('MMM D, YYYY'),
    },
    {
      key: 'expiryDate',
      label: 'Expires',
      render: (row) => {
        const expired = dayjs(row.expiryDate).isBefore(dayjs());
        const expiring = isExpiringSoon(row.expiryDate);
        return (
          <span className={expired ? 'text-red-600 font-semibold' : expiring ? 'text-yellow-600 font-semibold' : ''}>
            {dayjs(row.expiryDate).format('MMM D, YYYY')}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/certifications/${row.id}/edit`)}>
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
        { value: 'HALAL', label: 'Halal' },
        { value: 'KOSHER', label: 'Kosher' },
        { value: 'ISO', label: 'ISO' },
        { value: 'FSSC', label: 'FSSC' },
        { value: 'OTHER', label: 'Other' },
      ],
    },
    {
      key: 'expiringSoon',
      label: 'Expiry Filter',
      options: [{ value: 'true', label: 'Expiring Soon (30 days)' }],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
        <Button onClick={() => navigate('/certifications/new')}>
          <Plus className="h-4 w-4 mr-1" /> Add Certification
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4">
          <SearchFilter
            placeholder="Search certifications..."
            onSearch={(search) => setParams((p) => ({ ...p, search, page: 1 }))}
            filters={filters}
            onFilterChange={(key, value) => setParams((p) => ({ ...p, [key]: value, page: 1 }))}
          />
        </div>
        <DataTable
          columns={columns}
          data={data?.data}
          loading={isLoading}
          onRowClick={(row) => navigate(`/certifications/${row.id}/edit`)}
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
        title="Delete Certification"
        message="Are you sure you want to delete this certification?"
      />
    </div>
  );
}
