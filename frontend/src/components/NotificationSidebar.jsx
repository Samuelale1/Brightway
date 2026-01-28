import React, { useEffect, useState } from "react";
import { X, Bell, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NotificationSidebar = ({ isOpen, onClose, notifications, markAsRead }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Bell size={20} className="text-amber-500" />
            Notifications
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)] p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <p>No new notifications</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                  notif.read_at 
                    ? "bg-white border-gray-100 opacity-60" 
                    : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100 shadow-sm"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 text-sm">New Order #{notif.order_id}</h4>
                  {!notif.read_at && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                </div>
                <p className="text-xs text-gray-600 mb-2">{notif.message}</p>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-medium">
                        {notif.created_at ? formatDistanceToNow(new Date(notif.created_at), { addSuffix: true }) : 'Just now'}
                    </span>
                    {notif.read_at && <CheckCircle size={14} className="text-emerald-500" />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;
