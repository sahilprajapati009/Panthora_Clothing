import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import AdminNav from '../../components/AdminNav';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed');
    }
  };

  const filteredOrders = orders.filter((o) => filterStatus === 'all' || o.orderStatus === filterStatus);

  return (
    <div>
      <AdminNav />

      <div className="page-container pb-12 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-accent">Order Fulfillment</span>
            <h1 className="section-title mt-1">Manage Orders</h1>
          </div>

          <div className="flex items-center gap-2 bg-bg-surface p-2 border border-border">
            <span className="text-xs font-heading uppercase text-text-muted">Filter Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-bg-elevated border border-border text-text-primary text-xs font-heading uppercase px-3 py-1 outline-none focus:border-accent"
            >
              <option value="all">All Orders ({orders.length})</option>
              <option value="pending">Pending ({orders.filter((o) => o.orderStatus === 'pending').length})</option>
              <option value="confirmed">Confirmed ({orders.filter((o) => o.orderStatus === 'confirmed').length})</option>
              <option value="shipped">Shipped ({orders.filter((o) => o.orderStatus === 'shipped').length})</option>
              <option value="delivered">Delivered ({orders.filter((o) => o.orderStatus === 'delivered').length})</option>
              <option value="cancelled">Cancelled ({orders.filter((o) => o.orderStatus === 'cancelled').length})</option>
            </select>
          </div>
        </div>

        {loading ? (
          <Loader text="Loading orders..." />
        ) : filteredOrders.length === 0 ? (
          <EmptyState title="No orders match selected status" message="When customers place COD orders, they will appear here." />
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-bg-surface border border-border p-6 space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border pb-4 text-xs">
                  <div>
                    <span className="text-text-muted">Order ID: </span>
                    <span className="font-mono text-text-primary font-bold">{order._id}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Customer: </span>
                    <span className="text-text-primary font-semibold">{order.user?.name || 'Guest'}</span> ({order.user?.email})
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted">Status: </span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-bg-elevated border border-border text-text-primary text-xs font-heading uppercase px-2 py-1 outline-none focus:border-accent"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-border">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-heading font-semibold text-text-primary">{item.name}</span>
                        <span className="text-text-muted ml-2">({item.size} / {item.color} x {item.quantity})</span>
                      </div>
                      <span className="font-bold text-accent">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery info & Total */}
                <div className="border-t border-border pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-text-secondary">
                  <div>
                    <p><span className="text-text-muted">Ship to: </span>{order.shippingAddress?.fullName} ({order.shippingAddress?.phone})</p>
                    <p><span className="text-text-muted">Address: </span>{order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                  </div>
                  <div className="font-heading font-bold text-sm text-text-primary">
                    Total: <span className="text-accent">₹{order.totalAmount?.toLocaleString('en-IN')}</span> (COD)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
