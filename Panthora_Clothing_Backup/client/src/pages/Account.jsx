import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Account = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'border-status-warning text-status-warning',
      confirmed: 'border-status-info text-status-info',
      shipped: 'border-accent text-accent',
      delivered: 'border-status-success text-status-success',
      cancelled: 'border-status-error text-status-error',
    };
    return <span className={`badge ${styles[status] || 'border-border text-text-secondary'}`}>{status}</span>;
  };

  return (
    <div className="page-container py-12 space-y-10">
      {/* Account Info Header */}
      <div className="bg-bg-surface border border-border p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-accent">Customer Account</span>
          <h1 className="text-2xl font-heading font-bold text-text-primary mt-1">{user?.name}</h1>
          <p className="text-sm text-text-muted">{user?.email} {user?.phone && `• ${user.phone}`}</p>
        </div>
        <span className="badge border-accent text-accent">{user?.role === 'admin' ? 'Admin User' : 'Member'}</span>
      </div>

      {/* Orders Section */}
      <div className="space-y-6">
        <h2 className="section-title text-2xl">Order History</h2>

        {loading ? (
          <Loader text="Loading your orders..." />
        ) : orders.length === 0 ? (
          <EmptyState title="NO ORDERS PLACED YET" message="Your order history will appear here once you make your first purchase." />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-bg-surface border border-border p-6 space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-border pb-4 text-xs">
                  <div>
                    <span className="text-text-muted">Order ID: </span>
                    <span className="font-mono text-text-primary font-semibold">{order._id}</span>
                  </div>
                  <div>
                    <span className="text-text-muted">Date: </span>
                    <span className="text-text-primary">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div>{getStatusBadge(order.orderStatus)}</div>
                </div>

                {/* Items */}
                <div className="divide-y divide-border">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-heading font-semibold text-text-primary">{item.name}</p>
                        <p className="text-xs text-text-muted">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                      </div>
                      <span className="font-heading font-bold text-accent">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                {/* Order Total & Address summary */}
                <div className="border-t border-border pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-text-secondary">
                  <div>
                    <span>Shipping Address: </span>
                    <span className="text-text-primary">{order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.pincode}</span>
                  </div>
                  <div className="text-base font-heading font-bold text-text-primary">
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

export default Account;
