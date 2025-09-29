import { Star } from "lucide-react";
import React from "react";

interface StarRatingProps {
  count?: number;
  rating: number;
  onRatingChange: (newRating: number) => void;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  count = 5,
  rating,
  onRatingChange,
  size = 24,
}) => {
  return (
    <div className="flex items-center">
      {[...Array(count)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            onClick={() => onRatingChange(ratingValue)}
            className="focus:outline-none"
          >
            <Star
              className={`cursor-pointer transition-colors duration-200 ${
                ratingValue <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
              style={{ width: `${size}px`, height: `${size}px` }}
            />
          </button>
        );
      })}
    </div>
  );
};
