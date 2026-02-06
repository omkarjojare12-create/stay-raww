
import React from 'react';
import { OrderStatus } from '../../types';

interface OrderStatusTrackerProps {
    status: OrderStatus;
}

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ status }) => {
    const stages = [
        { name: OrderStatus.PLACED, icon: 'fa-box' },
        { name: OrderStatus.DISPATCHED, icon: 'fa-truck' },
        { name: OrderStatus.DELIVERED, icon: 'fa-check-circle' },
    ];

    const currentStatusIndex = stages.findIndex(s => s.name === status);

    if (status === OrderStatus.CANCELLED) {
        return (
            <div className="flex items-center justify-center p-4 bg-red-100 rounded-lg">
                <i className="fas fa-times-circle text-red-500 mr-3 text-xl"></i>
                <span className="font-semibold text-red-700">Order Cancelled</span>
            </div>
        );
    }
    
    return (
        <div className="w-full py-4 px-2">
            <div className="flex items-center">
                {stages.map((stage, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;

                    return (
                        <React.Fragment key={stage.name}>
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                    ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}
                                    ${isCurrent ? 'animate-pulse' : ''}`}>
                                    <i className={`fas ${stage.icon}`}></i>
                                </div>
                                <p className={`text-xs mt-2 text-center ${isCompleted ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                                    {stage.name}
                                </p>
                            </div>
                            {index < stages.length - 1 && (
                                <div className={`flex-1 h-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusTracker;
