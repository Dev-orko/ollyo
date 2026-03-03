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
  type: z.enum(
    ['ALLERGEN', 'AUDIT', 'DOCUMENT', 'FEEDBACK', 'NON_CONFORMANCE', 'RISK', 'TRAINING', 'RECALL'],
    { required_error: 'Type is required' }
  ),
  description: z.string().min(1, 'Description is required'),
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().optional(),
});

export default function ComplianceLogFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { useDetail, useCreate, useUpdate } = useCrud('complianceLogs', '/compliance-logs');
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
        type: detail.data.type || '',
        description: detail.data.description || '',
        relatedEntityType: detail.data.relatedEntityType || '',
        relatedEntityId: detail.data.relatedEntityId || '',
      });
    }
  }, [detail, reset]);

  const onSubmit = (formData) => {
    const cleaned = {
      ...formData,
      relatedEntityType: formData.relatedEntityType || null,
      relatedEntityId: formData.relatedEntityId || null,
    };
    if (isEdit) {
      updateMutation.mutate({ id, data: cleaned }, { onSuccess: () => navigate('/compliance-logs') });
    } else {
      createMutation.mutate(cleaned, { onSuccess: () => navigate('/compliance-logs') });
    }
  };

  if (isEdit && loadingDetail) return <LoadingScreen />;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Compliance Log' : 'New Compliance Log'}
      </h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Type *"
            {...register('type')}
            options={[
              { value: 'ALLERGEN', label: 'Allergen' },
              { value: 'AUDIT', label: 'Audit' },
              { value: 'DOCUMENT', label: 'Document' },
              { value: 'FEEDBACK', label: 'Feedback' },
              { value: 'NON_CONFORMANCE', label: 'Non-Conformance' },
              { value: 'RISK', label: 'Risk' },
              { value: 'TRAINING', label: 'Training' },
              { value: 'RECALL', label: 'Recall' },
            ]}
            placeholder="Select type"
            error={errors.type?.message}
          />
          <Textarea
            label="Description *"
            {...register('description')}
            error={errors.description?.message}
            rows={4}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Related Entity Type"
              {...register('relatedEntityType')}
              placeholder="e.g. Supplier, Product"
              error={errors.relatedEntityType?.message}
            />
            <Input
              label="Related Entity ID"
              {...register('relatedEntityId')}
              placeholder="UUID"
              error={errors.relatedEntityId?.message}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => navigate('/compliance-logs')}>
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
