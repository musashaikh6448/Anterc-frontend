import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, Search, Filter, User } from 'lucide-react';
import { getAllReviews } from '@/api/adminApi';
import { toast } from 'sonner';
import Pagination from '@/components/admin/Pagination';

const ReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data } = await getAllReviews();
            setReviews(data);
        } catch (error) {
            toast.error('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const filteredReviews = reviews.filter((review) => {
        const matchesSearch =
            review.subServiceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment?.toLowerCase().includes(searchTerm.toLowerCase());

        // Rating filter logic (e.g. "5", "4", "3"...)
        const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;

        return matchesSearch && matchesRating;
    });

    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, ratingFilter]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-yellow-50 px-4 py-1.5 rounded-full border border-yellow-100">
                    <Star size={14} className="text-yellow-600 fill-yellow-600" />
                    <span className="text-yellow-700 font-black text-[10px] uppercase tracking-widest">Customer Feedback</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[1.05]">
                    Service <span className="text-slate-400">Reviews</span>
                </h1>
                <p className="text-slate-500 max-w-2xl text-sm sm:text-base font-medium leading-relaxed">
                    Monitor customer ratings and feedback across all services.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <MessageSquare size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{reviews.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Total Reviews Received</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
                            <Star size={20} className="fill-current" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">
                        {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Average Star Rating</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by user, service, or comment..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="pl-12 pr-8 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none cursor-pointer font-medium"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {paginatedReviews.map((review) => (
                    <div key={review._id} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{review.user?.name || 'Anonymous user'}</h3>
                                    <p className="text-xs text-slate-500">
                                        {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg">
                                <span className="font-black text-yellow-700 text-lg">{review.rating}</span>
                                <Star size={16} className="text-yellow-500 fill-current" />
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Service Reviewed</p>
                            <p className="font-semibold text-slate-900">{review.subServiceName}</p>
                            <p className="text-xs text-slate-500">{review.service?.category}</p>
                        </div>

                        {review.comment && (
                            <div className="relative pl-4 border-l-2 border-slate-200">
                                <p className="text-slate-600 italic">"{review.comment}"</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {filteredReviews.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredReviews.length}
                />
            )}

            {filteredReviews.length === 0 && (
                <div className="text-center py-12 bg-white border border-slate-100 rounded-xl">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No reviews found matching your criteria</p>
                </div>
            )}
        </div>
    );
};

export default ReviewsPage;
