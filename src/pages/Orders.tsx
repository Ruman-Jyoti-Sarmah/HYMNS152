import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ordersApi, getUserId } from '@/db/api';
import type { OrderWithItems } from '@/types/types';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.getUserOrders(getUserId());
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders from API:', error);
      // Fallback to empty orders if API fails (database tables might not exist yet)
      setOrders([]);
      toast({
        title: "No orders found",
        description: "Your order history will appear here once you make a purchase",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-orange-600" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 bg-muted" />
            <Skeleton className="h-4 w-64 mt-2 bg-muted" />
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl xl:text-5xl font-bold text-black mb-2">
            My Orders
          </h1>
          <p className="text-black">
            Track and manage your orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-8">
              Your order history will appear here once you make a purchase
            </p>
            <Button asChild>
              <a href="/store">Start Shopping</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(-8)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">
                        ₹{order.total_amount.toFixed(2)}
                      </p>
                      <Badge className={`mt-2 ${getStatusColor(order.status)}`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product?.image_url || ''}
                            alt={item.product?.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">
                            {item.product?.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} {item.size && `• Size: ${item.size}`}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            ₹{item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-muted-foreground">
                        +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''} • Total: ₹{order.total_amount.toFixed(2)}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
