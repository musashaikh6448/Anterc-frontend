import React, { useEffect, useState } from 'react';
import { Search, Users, Zap } from 'lucide-react';
import { getAllCustomers } from '@/api/adminApi';
import { toast } from 'sonner';
import Pagination from '@/components/admin/Pagination';

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllCustomers();
      setCustomers(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header - Matching Home Page Style */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
          <Users size={14} className="text-indigo-600" />
          <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Customer Management</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[1.05]">
          All <span className="text-slate-400">Customers</span>
        </h1>
        <p className="text-slate-500 max-w-2xl text-sm sm:text-base font-medium leading-relaxed">
          View and manage all registered customers in your system.
        </p>
      </div>

      {/* Search - Matching Home Page Card Style */}
      <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* Stats Card - Reduced Size */}
      <div className="bg-slate-900 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-6 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-600/10 rounded-full blur-[80px] transition-all duration-1000 group-hover:bg-indigo-600/20"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">Total Customers</p>
            <p className="text-3xl sm:text-4xl font-black">{customers.length}</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <Users size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white border border-slate-100 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                        <Users size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{customer.phone}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{formatDate(customer.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {paginatedCustomers.map((customer) => (
          <div key={customer._id} className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                <Users size={20} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">{customer.name}</div>
                <div className="text-xs text-slate-500">{customer.phone}</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Joined</div>
              <div className="text-sm text-slate-500">{formatDate(customer.createdAt)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredCustomers.length}
        />
      )}

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-white border border-slate-100 rounded-xl">
          <p className="text-slate-500 font-medium">No customers found</p>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
