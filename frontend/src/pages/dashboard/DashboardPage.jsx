import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import {
  Users,
  Building2,
  Package,
  ShoppingCart,
  FileText,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingScreen from '../../components/ui/LoadingScreen';
import dayjs from 'dayjs';

const statColor = {
  customers: 'text-blue-600 bg-blue-100',
  suppliers: 'text-purple-600 bg-purple-100',
  products: 'text-green-600 bg-green-100',
  orders: 'text-orange-600 bg-orange-100',
};

const orderStatusColor = { PENDING: 'yellow', COMPLETED: 'green', CANCELLED: 'red' };
const stageColor = { LEAD: 'blue', NEGOTIATION: 'yellow', WON: 'green', LOST: 'red' };

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then((r) => r.data.data),
  });

  if (isLoading) return <LoadingScreen />;

  const d = data;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Customers" value={d.counts.customers} color={statColor.customers} />
        <StatCard icon={Building2} label="Suppliers" value={d.counts.suppliers} color={statColor.suppliers} />
        <StatCard icon={Package} label="Products" value={d.counts.products} color={statColor.products} />
        <StatCard icon={ShoppingCart} label="Orders" value={d.counts.orders.total} color={statColor.orders} />
      </div>

      {/* Order breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniStat label="Pending Orders" value={d.counts.orders.pending} color="text-yellow-600" />
        <MiniStat label="Completed Orders" value={d.counts.orders.completed} color="text-green-600" />
        <MiniStat label="Cancelled Orders" value={d.counts.orders.cancelled} color="text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Certifications */}
        <Card title="Certifications Expiring Soon" className="col-span-1">
          {d.expiringCertifications.length === 0 ? (
            <p className="text-sm text-gray-500">No certifications expiring within 30 days</p>
          ) : (
            <div className="space-y-3">
              {d.expiringCertifications.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{cert.supplier?.name}</p>
                    <p className="text-xs text-gray-500">{cert.type}</p>
                  </div>
                  <div className="text-right">
                    <Badge color="red">{dayjs(cert.expiryDate).format('MMM D, YYYY')}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Logs */}
        <Card title="Recent Compliance Logs" className="col-span-1">
          {d.recentLogs.length === 0 ? (
            <p className="text-sm text-gray-500">No recent logs</p>
          ) : (
            <div className="space-y-3">
              {d.recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge color="blue">{log.type}</Badge>
                      <span className="text-xs text-gray-400">{dayjs(log.createdAt).format('MMM D')}</span>
                    </div>
                    <p className="text-sm text-gray-700 truncate mt-1">{log.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Opportunities by Stage */}
        <Card title="Opportunities Overview" className="col-span-1">
          {d.opportunitiesByStage.length === 0 ? (
            <p className="text-sm text-gray-500">No opportunities yet</p>
          ) : (
            <div className="space-y-3">
              {d.opportunitiesByStage.map((item) => (
                <div key={item.stage} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <Badge color={stageColor[item.stage] || 'gray'}>{item.stage}</Badge>
                  <div className="text-right text-sm">
                    <span className="font-medium text-gray-900">{item.count}</span>
                    <span className="text-gray-500 ml-2">
                      ${Number(item.totalValue || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Orders */}
        <Card title="Recent Orders" className="col-span-1">
          {d.recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No recent orders</p>
          ) : (
            <div className="space-y-3">
              {d.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.customer?.name}</p>
                    <p className="text-xs text-gray-500">{dayjs(order.orderDate).format('MMM D, YYYY')}</p>
                  </div>
                  <Badge color={orderStatusColor[order.status]}>{order.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
