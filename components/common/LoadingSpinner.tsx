
import React from 'react';

const LoadingSpinner: React.FC<{ fullScreen?: boolean }> = ({ fullScreen = false }) => {
    const wrapperClasses = fullScreen
        ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        : "flex items-center justify-center p-4";

    return (
        <div className={wrapperClasses}>
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
        </div>
    );
};

export const LoadingModal: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-t-yellow-400 border-gray-200 rounded-full animate-spin"></div>
                <p className="text-gray-700">Processing...</p>
            </div>
        </div>
    );
}

export default LoadingSpinner;
