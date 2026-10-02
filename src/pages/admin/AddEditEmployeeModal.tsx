import React, { useState, useEffect } from 'react';
import { Employee, EmployeeType, EmployeeStatus, UserRole } from '../../types';
import { storageService } from '../../services/storageService';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

interface AddEditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
  onSaved: () => void;
}

export const AddEditEmployeeModal: React.FC<AddEditEmployeeModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit,
  onSaved
}) => {
  const { success, error } = useToast();
  const departments = storageService.getDepartments();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [employeeType, setEmployeeType] = useState<EmployeeType>('Teaching');
  const [department, setDepartment] = useState(departments[0]?.name || 'Computer Science & Engineering');
  const [designation, setDesignation] = useState('');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [status, setStatus] = useState<EmployeeStatus>('Active');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [dob, setDob] = useState('1990-01-01');

  // Salary
  const [basicSalary, setBasicSalary] = useState(5000);
  const [hra, setHra] = useState(1500);
  const [da, setDa] = useState(800);
  const [allowances, setAllowances] = useState(600);
  const [bankName, setBankName] = useState('State Academic Federal Bank');
  const [accountNumber, setAccountNumber] = useState('•••• •••• 1234');

  useEffect(() => {
    if (employeeToEdit) {
      setName(employeeToEdit.name);
      setEmail(employeeToEdit.email);
      setRole(employeeToEdit.role);
      setEmployeeType(employeeToEdit.employeeType);
      setDepartment(employeeToEdit.department);
      setDesignation(employeeToEdit.designation);
      setJoiningDate(employeeToEdit.joiningDate);
      setQualification(employeeToEdit.qualification);
      setExperienceYears(employeeToEdit.experienceYears);
      setContactNumber(employeeToEdit.contactNumber);
      setAddress(employeeToEdit.address);
      setEmergencyContact(employeeToEdit.emergencyContact);
      setBloodGroup(employeeToEdit.bloodGroup);
      setStatus(employeeToEdit.status);
      setGender(employeeToEdit.gender);
      setDob(employeeToEdit.dob);

      setBasicSalary(employeeToEdit.salary.basic);
      setHra(employeeToEdit.salary.hra);
      setDa(employeeToEdit.salary.da);
      setAllowances(employeeToEdit.salary.allowances);
      setBankName(employeeToEdit.salary.bankName);
      setAccountNumber(employeeToEdit.salary.accountNumber);
    } else {
      // Default clean values
      setName('');
      setEmail('');
      setRole('employee');
      setEmployeeType('Teaching');
      setDepartment(departments[0]?.name || 'Computer Science & Engineering');
      setDesignation('Assistant Professor');
      setJoiningDate(new Date().toISOString().split('T')[0]);
      setQualification('Ph.D. in Computer Science');
      setExperienceYears(4);
      setContactNumber('+1 (555) 000-0000');
      setAddress('College Campus Faculty Quarters');
      setEmergencyContact('Spouse / Family Contact');
      setBloodGroup('O+');
      setStatus('Active');
      setGender('Female');
      setDob('1992-06-15');
      setBasicSalary(5200);
      setHra(1500);
      setDa(900);
      setAllowances(700);
      setBankName('State Academic Federal Bank');
      setAccountNumber('•••• •••• 5521');
    }
  }, [employeeToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      error('Name and Email are required.');
      return;
    }

    const pfDeduction = Math.round(basicSalary * 0.12);
    const taxDeduction = Math.round(basicSalary * 0.15);
    const netSalary = basicSalary + hra + da + allowances - pfDeduction - taxDeduction;

    const payload: Employee = {
      id: employeeToEdit ? employeeToEdit.id : `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      email: email.trim(),
      avatar: employeeToEdit?.avatar || (gender === 'Female' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80'),
      role,
      employeeType,
      department,
      designation,
      joiningDate,
      qualification,
      experienceYears: Number(experienceYears),
      contactNumber,
      address,
      emergencyContact,
      bloodGroup,
      status,
      gender,
      dob,
      salary: {
        basic: Number(basicSalary),
        hra: Number(hra),
        da: Number(da),
        allowances: Number(allowances),
        pfDeduction,
        taxDeduction,
        netSalary,
        bankName,
        accountNumber,
        ifscCode: 'SAFB0004128'
      },
      leaveBalances: employeeToEdit?.leaveBalances || {
        casual: 12,
        sick: 10,
        academic: employeeType === 'Teaching' ? 14 : 0,
        earned: 20
      }
    };

    if (employeeToEdit) {
      storageService.updateEmployee(payload);
      success('Employee Updated', `Updated records for ${payload.name}`);
    } else {
      storageService.addEmployee(payload);
      success('Employee Created', `Successfully registered ${payload.name} as ${payload.employeeType}`);
    }

    onSaved();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employeeToEdit ? `Edit Employee Details: ${employeeToEdit.name}` : 'Onboard New College Employee'}
      description="Enter personal, academic, designation and compensation particulars."
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Basic & Role */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
            1. Identity & Role Assignment
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Full Name *"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Jennifer Adams"
            />
            <Input
              label="Institutional Email *"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. j.adams@campushr.edu"
            />
            <Select
              label="Employee Role *"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              options={[
                { label: 'Employee (Read-Only Self Service)', value: 'employee' },
                { label: 'Admin (Full Read/Write Access)', value: 'admin' },
              ]}
            />
          </div>
        </div>

        {/* Section 2: Academic & Employment Category */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
            2. Professional & Academic Classification
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Employee Type *"
              value={employeeType}
              onChange={(e) => setEmployeeType(e.target.value as EmployeeType)}
              options={[
                { label: 'Teaching Staff (Faculty/Professor)', value: 'Teaching' },
                { label: 'Non-Teaching Staff (Admin/Registrar)', value: 'Non-Teaching' },
              ]}
            />

            <Select
              label="Department *"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={departments.map(d => ({ label: d.name, value: d.name }))}
            />

            <Input
              label="Designation *"
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Associate Professor"
            />

            <Input
              label="Highest Qualification"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="e.g. Ph.D. in Computer Science"
            />

            <Input
              label="Experience (Years)"
              type="number"
              min="0"
              max="50"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
            />

            <Input
              label="Joining Date"
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
            />
          </div>
        </div>

        {/* Section 3: Personal & Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
            3. Contact & Personal Particulars
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Contact Phone"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />

            <Input
              label="Emergency Contact"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="Name (+1 phone, Relation)"
            />

            <Select
              label="Blood Group"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              options={[
                { label: 'O+', value: 'O+' },
                { label: 'O-', value: 'O-' },
                { label: 'A+', value: 'A+' },
                { label: 'A-', value: 'A-' },
                { label: 'B+', value: 'B+' },
                { label: 'B-', value: 'B-' },
                { label: 'AB+', value: 'AB+' },
                { label: 'AB-', value: 'AB-' }
              ]}
            />

            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Probation', value: 'Probation' },
                { label: 'On Leave', value: 'On Leave' },
                { label: 'Inactive', value: 'Inactive' }
              ]}
            />

            <Select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              options={[
                { label: 'Female', value: 'Female' },
                { label: 'Male', value: 'Male' },
                { label: 'Other', value: 'Other' }
              ]}
            />

            <Input
              label="Date of Birth"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className="mt-3">
            <Input
              label="Residential Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street Address, City, State, ZIP"
            />
          </div>
        </div>

        {/* Section 4: Compensation & Salary */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
            4. Compensation & Salary Structure (Monthly USD)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              label="Basic Pay ($)"
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(Number(e.target.value))}
            />
            <Input
              label="HRA ($)"
              type="number"
              value={hra}
              onChange={(e) => setHra(Number(e.target.value))}
            />
            <Input
              label="DA ($)"
              type="number"
              value={da}
              onChange={(e) => setDa(Number(e.target.value))}
            />
            <Input
              label="Special Allowance ($)"
              type="number"
              value={allowances}
              onChange={(e) => setAllowances(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <Input
              label="Disbursement Bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
            <Input
              label="Bank Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {employeeToEdit ? 'Save Changes' : 'Register Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
