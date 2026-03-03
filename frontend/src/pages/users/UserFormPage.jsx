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

const createSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  role: z.enum(['ADMIN', 'STAFF']).optional(),
});

const updateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email').optional(),
  role: z.enum(['ADMIN', 'STAFF']).optional(),
  isActive: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
});

export default function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { useDetail, useCreate, useUpdate } = useCrud('users', '/users');
  const { data: detail, isLoading: loadingDetail } = useDetail(id);
  const createMutation = useCreate();
  const updateMutation = useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? updateSchema : createSchema),
    defaultValues: { role: 'STAFF' },
  });

  useEffect(() => {
    if (detail?.data) {
      reset({
        name: detail.data.name || '',
        email: detail.data.email || '',
        role: detail.data.role || 'STAFF',
        isActive: detail.data.isActive ? 'true' : 'false',
      });
    }
  }, [detail, reset]);

  const onSubmit = (formData) => {
    if (isEdit) {
      updateMutation.mutate({ id, data: formData }, { onSuccess: () => navigate('/users') });
    } else {
      createMutation.mutate(formData, { onSuccess: () => navigate('/users') });
    }
  };

  if (isEdit && loadingDetail) return <LoadingScreen />;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit User' : 'New User'}
      </h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name *" {...register('name')} error={errors.name?.message} />
          <Input label="Email *" type="email" {...register('email')} error={errors.email?.message} />
          {!isEdit && (
            <Input
              label="Password *"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Min 8 chars, uppercase, lowercase, number"
            />
          )}
          <Select
            label="Role"
            {...register('role')}
            options={[
              { value: 'ADMIN', label: 'Admin' },
              { value: 'STAFF', label: 'Staff' },
            ]}
            error={errors.role?.message}
          />
          {isEdit && (
            <Select
              label="Status"
              {...register('isActive')}
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
              error={errors.isActive?.message}
            />
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => navigate('/users')}>
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
