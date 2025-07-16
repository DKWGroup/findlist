import { Flag, Star, ThumbsDown, ThumbsUp, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSimplifiedAuthContext } from "../contexts/SimplifiedAuthContext";
import { supabase } from "../services/supabaseStorage";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  dateCreated: string;
  isVerified: boolean;
  likes: number;
  dislikes: number;
  isHelpful?: boolean;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  onAddReview: (
    review: Omit<Review, "id" | "dateCreated" | "likes" | "dislikes">
  ) => void;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  reviews,
  onAddReview,
}) => {
  const { isAuthenticated, user } = useSimplifiedAuthContext();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewsState, setReviews] = useState(reviews);

  const userHasReviewed = reviewsState.some(
    (review) => review.userId === user?.id
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "🔄 [REVIEW_SUBMIT] Rozpoczęcie dodawania recenzji dla produktu:",
      productId
    );
    console.log("👤 [REVIEW_SUBMIT] Użytkownik:", user?.id);
    console.log("📝 [REVIEW_SUBMIT] Dane recenzji:", newReview);

    if (!user || !newReview.comment.trim()) {
      console.warn("⚠️ [REVIEW_SUBMIT] Brak użytkownika lub komentarza");
      return;
    }

    setIsSubmitting(true);

    try {
      // Add review to database using the new function
      console.log(
        "📤 [REVIEW_SUBMIT] Wysyłanie RPC add_product_review z parametrami p_*"
      );
      const { data, error } = await supabase.rpc("add_product_review", {
        p_product_id: productId,
        p_user_id: user.id,
        p_rating: newReview.rating,
        p_comment: newReview.comment.trim(),
      });

      if (error) {
        console.error("❌ [REVIEW_SUBMIT] Błąd RPC:", error);
        throw error;
      }

      console.log(
        "✅ [REVIEW_SUBMIT] Recenzja dodana do bazy danych, review_id:",
        data
      );

      // Sprawdźmy strukturę user obiektu
      console.log("🔍 [DEBUG] Struktura user obiektu:", user);

      const reviewData = {
        userId: user.id,
        userName:
          (user as any).name ||
          (user as any).user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Użytkownik",
        userAvatar:
          (user as any).avatar || (user as any).user_metadata?.avatar_url,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        isVerified: (user as any).role === "admin",
      };

      console.log(
        "📤 [REVIEW_SUBMIT] Wywołanie onAddReview z danymi:",
        reviewData
      );
      onAddReview(reviewData);

      console.log("🧹 [REVIEW_SUBMIT] Czyszczenie formularza...");
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);

      console.log("✅ [REVIEW_SUBMIT] Recenzja została pomyślnie dodana");
    } catch (error) {
      console.error("❌ [REVIEW_SUBMIT] Błąd dodawania recenzji:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    reviewsState.length > 0
      ? reviewsState.reduce((sum, review) => sum + review.rating, 0) /
        reviewsState.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviewsState.filter((review) => review.rating === rating).length,
    percentage:
      reviewsState.length > 0
        ? (reviewsState.filter((review) => review.rating === rating).length /
            reviewsState.length) *
          100
        : 0,
  }));

  useEffect(() => {
    const loadReviews = async () => {
      console.log(
        "🔄 [LOAD_REVIEWS] Rozpoczęcie ładowania recenzji dla produktu:",
        productId
      );
      try {
        // Use the get_product_reviews function with correct parameter name
        console.log(
          "📤 [LOAD_REVIEWS] Pobieranie recenzji z parametrem p_product_id"
        );
        const { data, error } = await supabase.rpc("get_product_reviews", {
          p_product_id: productId,
        });

        if (error) {
          console.error("❌ [LOAD_REVIEWS] Błąd RPC:", error);
          // Nie rzucamy błędu, tylko ustawiamy pustą tablicę
          setReviews([]);
          return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
          console.log(
            "✅ [LOAD_REVIEWS] Załadowano recenzje:",
            data.length,
            "recenzji"
          );
          console.log("📄 [LOAD_REVIEWS] Szczegóły recenzji:", data);
          setReviews(data);
        } else {
          console.log("ℹ️ [LOAD_REVIEWS] Brak recenzji dla produktu");
          console.log(
            "📄 [LOAD_REVIEWS] Typ i zawartość data:",
            typeof data,
            data
          );
          setReviews([]);
        }
      } catch (error) {
        console.error("❌ [LOAD_REVIEWS] Błąd ładowania recenzji:", error);
        setReviews([]);
      }
    };

    console.log(
      "🚀 [LOAD_REVIEWS] useEffect uruchomiony dla produktu:",
      productId
    );
    loadReviews();
  }, [productId]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Opinie użytkowników ({reviewsState.length})
        </h3>
        {isAuthenticated && !userHasReviewed && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Dodaj opinię
          </button>
        )}
      </div>

      {/* Rating Summary */}
      {reviewsState.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Na podstawie {reviewsState.length} opinii
            </p>
          </div>

          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-gray-600">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-gray-600 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && isAuthenticated && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-8 p-4 bg-blue-50 rounded-lg"
        >
          <h4 className="font-semibold text-gray-900 mb-4">
            Dodaj swoją opinię
          </h4>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ocena
            </label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    setNewReview((prev) => ({ ...prev, rating: i + 1 }))
                  }
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-6 w-6 ${
                      i < newReview.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Komentarz
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, comment: e.target.value }))
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Podziel się swoją opinią o tym produkcie..."
              required
            />
          </div>

          <div className="mb-4 flex items-start gap-2">
            <input
              type="checkbox"
              id="review-terms"
              required
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="review-terms" className="text-sm text-gray-600">
              Akceptuję{" "}
              <a
                href="/regulamin"
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                regulamin
              </a>{" "}
              oraz{" "}
              <a
                href="/polityka-prywatnosci"
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                politykę prywatności
              </a>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !newReview.comment.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Dodawanie...</span>
                </>
              ) : (
                <span>Dodaj opinię</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Anuluj
            </button>
          </div>
        </form>
      )}

      {/* Login Prompt */}
      {!isAuthenticated && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-3">
            Zaloguj się, aby dodać opinię o tym produkcie
          </p>
          <a
            href="/logowanie"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
          >
            Zaloguj się
          </a>
        </div>
      )}

      {/* User Already Reviewed */}
      {isAuthenticated && userHasReviewed && (
        <div className="mb-8 p-4 bg-green-50 rounded-lg">
          <p className="text-green-700 text-center">
            ✓ Już dodałeś opinię o tym produkcie
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviewsState.length === 0 ? (
          <div className="text-center py-8">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Brak opinii
            </h4>
            <p className="text-gray-600">
              Bądź pierwszą osobą, która podzieli się opinią o tym produkcie!
            </p>
          </div>
        ) : (
          reviewsState.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-6 last:border-b-0"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {review.userAvatar ? (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-blue-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {review.userName}
                    </span>
                    {review.isVerified && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        Zweryfikowany
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(review.dateCreated).toLocaleDateString("pl-PL")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Pomocne ({review.likes})</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors">
                      <ThumbsDown className="h-4 w-4" />
                      <span>Niepomocne ({review.dislikes})</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors">
                      <Flag className="h-4 w-4" />
                      <span>Zgłoś</span>
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
