import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { createReview } from '@/api/customerApi'; // Assuming we'll add this next

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    enquiry: any; // The completed enquiry object
    onSuccess: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, enquiry, onSuccess }) => {
    // Handling multi-service: We need to rate each item.
    // However, the UX for rating 5 items at once can be tedious.
    // Let's show a list of items to rate.

    // For single item, it's straightforward.
    // For multi-item, we can iterate or show a list.

    // Let's go with a list view where user can expand/rate each item. 
    // Or just a sequence of modals? No, list is better.

    // First, standardizing the items list.
    const itemsToRate = enquiry?.items?.length > 0
        ? enquiry.items
        : [{
            name: enquiry?.serviceType,
            category: enquiry?.applianceType,
            // For single service enquiry, we don't have subServiceId easily available in old format?
            // Wait, the backend Review model requires serviceId and subServiceId.
            // Old single-service enquiries might not have this granular data stored in the same way.
            // But new multi-service ones do.
            // If it's an old enquiry, we might not be able to link it to a specific sub-service efficiently
            // without looking up the Service by name.

            // For now, let's assume we can only robustly review items that have serviceId/subServiceId info.
            // Which are the new multi-item enquiries.

            // Actually, for single service, we might have stored it?
            // Looking at Enquiry model... it has serviceType, applianceType.
            // It doesn't store the exact Service ID unless we updated it.

            // Let's focus on the new Multi-Service enquiries first as they have the IDs.
            serviceId: '', // Placeholder if missing
            subServiceId: '', // Placeholder
            _id: 'single-item'
        }];

    // State for ratings: map of subServiceId -> { rating, comment, submitted }
    const [reviews, setReviews] = useState<Record<string, { rating: number, comment: string, submitted: boolean }>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && enquiry) {
            // Initialize state
            const initialReviews: any = {};
            if (enquiry.items && enquiry.items.length > 0) {
                enquiry.items.forEach((item: any) => {
                    // Use composite key if subServiceId is not unique across services (it should be unique within service)
                    // item.subServiceId is unique enough usually
                    initialReviews[item.subServiceId] = { rating: 0, comment: '', submitted: false };
                });
            }
            setReviews(initialReviews);
        }
    }, [isOpen, enquiry]);

    if (!isOpen || !enquiry) return null;

    const handleRating = (subServiceId: string, rating: number) => {
        setReviews(prev => ({
            ...prev,
            [subServiceId]: { ...prev[subServiceId], rating }
        }));
    };

    const handleComment = (subServiceId: string, comment: string) => {
        setReviews(prev => ({
            ...prev,
            [subServiceId]: { ...prev[subServiceId], comment }
        }));
    };

    const handleSubmitSingle = async (item: any) => {
        const reviewData = reviews[item.subServiceId];
        if (!reviewData || reviewData.rating === 0) {
            toast.error('Please select a star rating');
            return;
        }

        if (!item.serviceId || !item.subServiceId) {
            toast.error('Cannot review this item (missing service details)');
            return;
        }

        setLoading(true);
        try {
            await createReview({
                serviceId: item.serviceId,
                subServiceId: item.subServiceId,
                subServiceName: item.name,
                rating: reviewData.rating,
                comment: reviewData.comment,
                enquiryId: enquiry._id
            });

            setReviews(prev => ({
                ...prev,
                [item.subServiceId]: { ...prev[item.subServiceId], submitted: true }
            }));

            toast.success(`Review submitted for ${item.name}`);

            // Check if all are submitted?
            // Optional: close modal if all done.

        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to submit review';
            if (msg.toLowerCase().includes('already reviewed')) {
                setReviews(prev => ({
                    ...prev,
                    [item.subServiceId]: { ...prev[item.subServiceId], submitted: true }
                }));
                toast.success('Already reviewed, updated status');
            } else {
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Rate Service</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Share your experience with us</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-8">
                    {enquiry.items && enquiry.items.length > 0 ? (
                        enquiry.items.map((item: any) => {
                            const reviewState = reviews[item.subServiceId] || { rating: 0, comment: '', submitted: false };

                            if (reviewState.submitted) return null; // Hide submitted ones or show success state?

                            return (
                                <div key={item.subServiceId} className="space-y-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{item.name}</h3>
                                            <p className="text-xs text-slate-500">{item.category}</p>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => handleRating(item.subServiceId, star)}
                                                className={`transition-all hover:scale-110 ${star <= reviewState.rating
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-slate-200 fill-slate-200'
                                                    }`}
                                            >
                                                <Star size={28} />
                                            </button>
                                        ))}
                                    </div>

                                    {/* Comment */}
                                    <div className="relative">
                                        <MessageSquare size={16} className="absolute left-3 top-3 text-slate-400" />
                                        <textarea
                                            value={reviewState.comment}
                                            onChange={(e) => handleComment(item.subServiceId, e.target.value)}
                                            placeholder="Write a review (optional)..."
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm min-h-[80px] resize-none"
                                        />
                                    </div>

                                    <button
                                        onClick={() => handleSubmitSingle(item)}
                                        disabled={loading || reviewState.rating === 0}
                                        className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            Rating is currently only available for new multi-service orders.
                        </div>
                    )}

                    {/* Show message if all reviewed */}
                    {enquiry.items && enquiry.items.every((item: any) => reviews[item.subServiceId]?.submitted) && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Star size={32} className="fill-current" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Thank You!</h3>
                            <p className="text-slate-500">You have reviewed all services in this order.</p>
                            <button onClick={onSuccess} className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm">
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
