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
  customerId: z.string().min(1, 'Customer is required'),
  stage: z.enum(['LEAD', 'NEGOTIATION', 'WON', 'LOST']).optional(),
  value: z.coerce.number().positive('Must be positive').or(z.literal('')).optional(),
  notes: z.string().optional(),
});

export default function OpportunityFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { useDetail, useCreate, useUpdate } = useCrud('opportunities', '/opportunities');
  const { useList: useCustomerList } = useCrud('customers', '/customers');
  const { data: detail, isLoading: loadingDetail } = useDetail(id);
  const { data: customersData } = useCustomerList({ limit: 200 });
  const createMutation = useCreate();
  const updateMutation = useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { stage: 'LEAD' },
  });

  useEffect(() => {
    if (detail?.data) {
      reset({
        customerId: detail.data.customerId || '',
        stage: detail.data.stage || 'LEAD',
        value: detail.data.value != null ? Number(detail.data.value) : '',
        notes: detail.data.notes || '',
      });
    }
  }, [detail, reset]);

  const onSubmit = (formData) => {
    const cleaned = {
      ...formData,
      value: formData.value !== '' ? Number(formData.value) : null,
      notes: formData.notes || null,
    };
    if (isEdit) {
      updateMutation.mutate({ id, data: cleaned }, { onSuccess: () => navigate('/opportunities') });
    } else {
      createMutation.mutate(cleaned, { onSuccess: () => navigate('/opportunities') });
    }
  };

  if (isEdit && loadingDetail) return <LoadingScreen />;

  const customerOptions = (customersData?.data || []).map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Opportunity' : 'New Opportunity'}
      </h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Customer *"
            {...register('customerId')}
            options={customerOptions}
            placeholder="Select customer"
            error={errors.customerId?.message}
          />
          <Select
            label="Stage"
            {...register('stage')}
            options={[
              { value: 'LEAD', label: 'Lead' },
              { value: 'NEGOTIATION', label: 'Negotiation' },
              { value: 'WON', label: 'Won' },
              { value: 'LOST', label: 'Lost' },
            ]}
            error={errors.stage?.message}
          />
          <Input
            label="Value ($)"
            type="number"
            step="0.01"
            {...register('value')}
            error={errors.value?.message}
          />
          <Textarea label="Notes" {...register('notes')} error={errors.notes?.message} rows={3} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => navigate('/opportunities')}>
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
