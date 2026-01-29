import React from "react";
import OrdersSection from "../../components/OrdersSection";

const Orders = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-12">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">📦 Order Management</h1>
            <p className="text-slate-500 mt-1">Track and manage customer orders efficiently.</p>
          </div>
        </div>
        <OrdersSection />
    </div>
  );
};

export default Orders;
