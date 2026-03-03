import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCrud } from '../../hooks/useCrud';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingScreen from '../../components/ui/LoadingScreen';

const schema = z.object({
  supplierId: z.string().min(1, 'Supplier is required'),
  type: z.enum(['HALAL', 'KOSHER', 'ISO', 'FSSC', 'OTHER'], { required_error: 'Type is required' }),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  documentUrl: z.string().optional(),
});

export default function CertificationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { useDetail, useCreate, useUpdate } = useCrud('certifications', '/certifications');
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
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (detail?.data) {
      const d = detail.data;
      reset({
        supplierId: d.supplierId || '',
        type: d.type || '',
        issueDate: d.issueDate ? d.issueDate.slice(0, 10) : '',
        expiryDate: d.expiryDate ? d.expiryDate.slice(0, 10) : '',
        documentUrl: d.documentUrl || '',
      });
    }
  }, [detail, reset]);

  const onSubmit = (formData) => {
    const cleaned = {
      ...formData,
      issueDate: new Date(formData.issueDate).toISOString(),
      expiryDate: new Date(formData.expiryDate).toISOString(),
      documentUrl: formData.documentUrl || null,
    };
    if (isEdit) {
      updateMutation.mutate({ id, data: cleaned }, { onSuccess: () => navigate('/certifications') });
    } else {
      createMutation.mutate(cleaned, { onSuccess: () => navigate('/certifications') });
    }
  };

  if (isEdit && loadingDetail) return <LoadingScreen />;

  const supplierOptions = (suppliersData?.data || []).map((s) => ({ value: s.id, label: s.name }));

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Certification' : 'New Certification'}
      </h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Supplier *"
            {...register('supplierId')}
            options={supplierOptions}
            placeholder="Select supplier"
            error={errors.supplierId?.message}
          />
          <Select
            label="Type *"
            {...register('type')}
            options={[
              { value: 'HALAL', label: 'Halal' },
              { value: 'KOSHER', label: 'Kosher' },
              { value: 'ISO', label: 'ISO' },
              { value: 'FSSC', label: 'FSSC' },
              { value: 'OTHER', label: 'Other' },
            ]}
            placeholder="Select type"
            error={errors.type?.message}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Issue Date *" type="date" {...register('issueDate')} error={errors.issueDate?.message} />
            <Input label="Expiry Date *" type="date" {...register('expiryDate')} error={errors.expiryDate?.message} />
          </div>
          <Input label="Document URL" {...register('documentUrl')} error={errors.documentUrl?.message} placeholder="https://..." />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => navigate('/certifications')}>
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
