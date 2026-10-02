import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { EmployeeDetailPage } from '../admin/EmployeeDetailPage';
import { ReadOnlyBadge } from '../../components/ui/ReadOnlyBadge';

export const MyProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="space-y-4">
      {/* Explicit Employee Profile View with enforced read-only mode */}
      <EmployeeDetailPage employeeId={currentUser.id} isReadOnly={true} />
    </div>
  );
};
