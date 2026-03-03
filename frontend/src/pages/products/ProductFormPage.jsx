import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCrud } from '../../hooks/useCrud';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingScreen from '../../components/ui/LoadingScreen';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().optional(),
  supplierId: z.string().min(1, 'Supplier is required'),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { useDetail, useCreate, useUpdate } = useCrud('products', '/products');
  const { useList: useSupplierList } = useCrud('suppliers', '/suppliers');
  const { data: detail, isLoading: loadingDetail } = useDetail(id);
  const { data: suppliersData } = useSupplierList({ limit: 200 });
  const createMutation = useCreate();
  const updateMutation = useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'ACTIVE' },
  });

  useEffect(() => {
    if (detail?.data) {
      reset({
        name: detail.data.name || '',
        sku: detail.data.sku || '',
        description: detail.data.description || '',
        supplierId: detail.data.supplierId || '',
        status: detail.data.status || 'ACTIVE',
      });
    }
  }, [detail, reset]);

  const onSubmit = (formData) => {
    const cleaned = {
      ...formData,
      description: formData.description || null,
    };
    if (isEdit) {
      updateMutation.mutate({ id, data: cleaned }, { onSuccess: () => navigate('/products') });
    } else {
      createMutation.mutate(cleaned, { onSuccess: () => navigate('/products') });
    }
  };

  if (isEdit && loadingDetail) return <LoadingScreen />;

  const supplierOptions = (suppliersData?.data || []).map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Product' : 'New Product'}
      </h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name *" {...register('name')} error={errors.name?.message} />
          <Input label="SKU *" {...register('sku')} error={errors.sku?.message} />
          <Select
            label="Supplier *"
            {...register('supplierId')}
            options={supplierOptions}
            placeholder="Select a supplier"
            error={errors.supplierId?.message}
          />
          <Select
            label="Status"
            {...register('status')}
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]}
            error={errors.status?.message}
          />
          <Textarea label="Description" {...register('description')} error={errors.description?.message} rows={3} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => navigate('/products')}>
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
