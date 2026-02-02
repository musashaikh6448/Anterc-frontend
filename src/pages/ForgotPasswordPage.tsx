import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Smartphone, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { verifyPhone, resetPassword } from '@/api/passwordApi';

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'phone' | 'password'>('phone');
    const [phone, setPhone] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleVerifyPhone = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!/^\d{10}$/.test(phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        try {
            await verifyPhone(phone);
            toast.success('Phone number verified!');
            setStep('password');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Phone number not found');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(phone, newPassword);
            toast.success('Password reset successfully!');
            setTimeout(() => navigate('/auth'), 1500);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <button
                    onClick={() => step === 'phone' ? navigate('/auth') : setStep('phone')}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 text-sm font-semibold"
                >
                    <ChevronLeft size={18} />
                    {step === 'phone' ? 'Back to Login' : 'Back'}
                </button>

                <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Lock size={32} className="text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">
                            {step === 'phone' ? 'Forgot Password?' : 'Reset Password'}
                        </h1>
                        <p className="text-slate-500">
                            {step === 'phone'
                                ? 'Enter your phone number to verify your account'
                                : 'Enter your new password'}
                        </p>
                    </div>

                    {step === 'phone' ? (
                        <form onSubmit={handleVerifyPhone} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Smartphone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700"
                                        placeholder="Enter 10-digit number"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Verifying...' : 'Verify Phone Number'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <CheckCircle2 size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-700"
                                        placeholder="Re-enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
