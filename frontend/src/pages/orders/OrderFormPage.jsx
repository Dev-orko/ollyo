import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCrud } from '../../hooks/useCrud';
import { Plus, Trash2 } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingScreen from '../../components/ui/LoadingScreen';

const itemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().int().min(1, 'Min 1'),
  price: z.coerce.number().min(0.01, 'Min 0.01'),
});

const schema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  orderDate: z.string().optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']).optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, 'At least one item is required'),
});

export default function OrderFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { useDetail, useCreate, useUpdate } = useCrud('orders', '/orders');
  const { useList: useCustomerList } = useCrud('customers', '/customers');
  const { useList: useProductList } = useCrud('products', '/products');

  const { data: detail, isLoading: loadingDetail } = useDetail(id);
  const { data: customersData } = useCustomerList({ limit: 200 });
  const { data: productsData } = useProductList({ limit: 200, status: 'ACTIVE' });
  const createMutation = useCreate();
  const updateMutation = useUpdate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'PENDING',
      items: [{ productId: '', quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    if (detail?.data) {
      const d = detail.data;
      reset({
        customerId: d.customerId || '',
        orderDate: d.orderDate ? d.orderDate.slice(0, 10) : '',
        status: d.status || 'PENDING',
        notes: d.notes || '',
        items: d.items?.length
          ? d.items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              price: Number(i.price),
            }))
          : [{ productId: '', quantity: 1, price: 0 }],
      });
    }
  }, [detail, reset]);

  const items = watch('items');
  const total = items?.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0) || 0;

  const onSubmit = (formData) => {
    const cleaned = {
      ...formData,
      orderDate: formData.orderDate ? new Date(formData.orderDate).toISOString() : undefined,
      notes: formData.notes || null,
    };
    if (isEdit) {
      updateMutation.mutate({ id, data: cleaned }, { onSuccess: () => navigate('/orders') });
    } else {
      createMutation.mutate(cleaned, { onSuccess: () => navigate('/orders') });
    }
  };

  if (isEdit && loadingDetail) return <LoadingScreen />;

  const customerOptions = (customersData?.data || []).map((c) => ({ value: c.id, label: c.name }));
  const productOptions = (productsData?.data || []).map((p) => ({
    value: p.id,
    label: `${p.name} (${p.sku})`,
  }));

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Edit Order' : 'New Order'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Order Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Customer *"
              {...register('customerId')}
              options={customerOptions}
              placeholder="Select customer"
              error={errors.customerId?.message}
            />
            <Input
              label="Order Date"
              type="date"
              {...register('orderDate')}
              error={errors.orderDate?.message}
            />
            <Select
              label="Status"
              {...register('status')}
              options={[
                { value: 'PENDING', label: 'Pending' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
              error={errors.status?.message}
            />
          </div>
          <Textarea
            label="Notes"
            {...register('notes')}
            error={errors.notes?.message}
            rows={2}
            className="mt-4"
          />
        </Card>

        <Card
          title="Line Items"
          action={
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => append({ productId: '', quantity: 1, price: 0 })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          }
        >
          {errors.items?.root && (
            <p className="text-sm text-red-600 mb-3">{errors.items.root.message}</p>
          )}
          {errors.items?.message && (
            <p className="text-sm text-red-600 mb-3">{errors.items.message}</p>
          )}
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start">
                <div className="flex-1">
                  <Select
                    label={index === 0 ? 'Product *' : undefined}
                    {...register(`items.${index}.productId`)}
                    options={productOptions}
                    placeholder="Select product"
                    error={errors.items?.[index]?.productId?.message}
                  />
                </div>
                <div className="w-24">
                  <Input
                    label={index === 0 ? 'Qty *' : undefined}
                    type="number"
                    min={1}
                    {...register(`items.${index}.quantity`)}
                    error={errors.items?.[index]?.quantity?.message}
                  />
                </div>
                <div className="w-32">
                  <Input
                    label={index === 0 ? 'Price *' : undefined}
                    type="number"
                    step="0.01"
                    min={0}
                    {...register(`items.${index}.price`)}
                    error={errors.items?.[index]?.price?.message}
                  />
                </div>
                <div className={index === 0 ? 'mt-6' : ''}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fields.length > 1 && remove(index)}
                    disabled={fields.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
            <span className="text-lg font-semibold text-gray-900">
              Total: ${total.toFixed(2)}
            </span>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={() => navigate('/orders')}>
            Cancel
          </Button>
          <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
            {isEdit ? 'Update Order' : 'Create Order'}
          </Button>
        </div>
      </form>
    </div>
  );
}
