
import React from 'react';

interface StarRatingProps {
    rating: number;
    reviewCount?: number;
    size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ rating, reviewCount, size = 'md' }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    return (
        <div className={`flex items-center ${sizeClasses[size]}`}>
            <div className="flex items-center text-amber-400">
                {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star"></i>)}
                {halfStar && <i className="fas fa-star-half-alt"></i>}
                {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star"></i>)}
            </div>
            {reviewCount !== undefined && (
                <span className="text-gray-500 text-xs ml-2">({reviewCount})</span>
            )}
        </div>
    );
};

export default StarRating;
