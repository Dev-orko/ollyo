import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCrud } from '../../hooks/useCrud';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingScreen from '../../components/ui/LoadingScreen';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').or(z.literal('')).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export default function SupplierFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { useDetail, useCreate, useUpdate } = useCrud('suppliers', '/suppliers');
  const { data: detail, isLoading: loadingDetail } = useDetail(id);
  const createMutation = useCreate();
  const updateMutation = useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (detail?.data) {
      reset({
        name: detail.data.name || '',
        email: detail.data.email || '',
        phone: detail.data.phone || '',
        address: detail.data.address || '',
      });
    }
  }, [detail, reset]);

  const onSubmit = (formData) => {
    const cleaned = {
      ...formData,
      email: formData.email || null,
      phone: formData.phone || null,
      address: formData.address || null,
    };
    if (isEdit) {
      updateMutation.mutate({ id, data: cleaned }, { onSuccess: () => navigate('/suppliers') });
    } else {
      createMutation.mutate(cleaned, { onSuccess: () => navigate('/suppliers') });
    }
  };

  if (isEdit && loadingDetail) return <LoadingScreen />;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Supplier' : 'New Supplier'}
      </h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name *" {...register('name')} error={errors.name?.message} />
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
          <Input label="Address" {...register('address')} error={errors.address?.message} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => navigate('/suppliers')}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
