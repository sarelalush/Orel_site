import React, { useState, useEffect } from 'react';
import { Shield, Search, UserCheck, UserX } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateUserRole } from '../../lib/supabase';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  role: string | null;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch users from the public users table
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*');

      if (usersError) throw usersError;

      // For each user, get their role from their metadata
      const usersWithRoles = await Promise.all((usersData || []).map(async (user) => {
        try {
          // Get user metadata to determine role
          const { data: metaData } = await supabase.rpc('get_user_metadata', {
            user_id: user.id
          });
          
          return {
            ...user,
            role: metaData?.role || 'user'
          };
        } catch (error) {
          console.warn(`Could not get role for user ${user.id}:`, error);
          return {
            ...user,
            role: 'user'
          };
        }
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('error', 'שגיאה בטעינת המשתמשים');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, makeAdmin: boolean) => {
    try {
      const { error } = await updateUserRole(userId, makeAdmin);
      if (error) throw error;

      showNotification('success', `הרשאות המשתמש עודכנו ${makeAdmin ? 'למנהל' : 'למשתמש רגיל'}`);
      
      // Update the local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: makeAdmin ? 'admin' : 'user' } 
          : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
      showNotification('error', 'שגיאה בעדכון הרשאות המשתמש');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ניהול משתמשים</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="חיפוש משתמשים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right py-3 px-4">שם</th>
                <th className="text-right py-3 px-4">אימייל</th>
                <th className="text-right py-3 px-4">תפקיד</th>
                <th className="text-right py-3 px-4">תאריך הרשמה</th>
                <th className="text-right py-3 px-4">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.full_name || 'לא צוין'}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                      user.role === 'admin' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Shield className="w-4 h-4" />
                      {user.role === 'admin' ? 'מנהל' : 'משתמש'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(user.created_at).toLocaleDateString('he-IL')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {user.role === 'admin' ? (
                        <button
                          onClick={() => handleRoleChange(user.id, false)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded tooltip"
                          title="הסר הרשאות מנהל"
                        >
                          <UserX className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(user.id, true)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded tooltip"
                          title="הפוך למנהל"
                        >
                          <UserCheck className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}