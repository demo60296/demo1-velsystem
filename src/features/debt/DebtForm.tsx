import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCreateDebt, useUpdateDebt, useDebt } from './hooks/useDebts';
import { useAccounts } from '../account/hooks/useAccounts';
import { CreateDebtData } from './types/debt';
import FormHeader from '../../components/forms/FormHeader';
import FormDateTimeFields from '../../components/forms/FormDateTimeFields';
import FormAmountField from '../../components/forms/FormAmountField';
import FormDescriptionField from '../../components/forms/FormDescriptionField';
import FormAccountField from '../../components/forms/FormAccountField';
import FormActions from '../../components/forms/FormActions';
import FormLoadingSkeleton from '../../components/forms/FormLoadingSkeleton';
import FormTypeToggle from '../../components/forms/FormTypeToggle';
import FormInput from '../../components/forms/FormInput';
import FormTextarea from '../../components/forms/FormTextarea';
import FormSection from '../../components/forms/FormSection';
import FormProgressIndicator from '../../components/forms/FormProgressIndicator';
import { getCurrentDateTime } from '../../utils/formUtils';

interface FormData {
  personName: string;
  dueDate: string;
  additionalDetail: string;
  type: '1' | '2';
  date: string;
  amount: number;
  description: string;
  accountId: string;
  paymentModeId?: string;
  recordType: '1' | '2';
}

function DebtForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(id);
  const [step, setStep] = useState(1);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const debtType = location.state?.debtType as '1' | '2' | undefined;

  const { data: debt, isLoading: debtLoading } = useDebt(id || '');
  const { data: accounts = [] } = useAccounts();
  const createDebt = useCreateDebt();
  const updateDebt = useUpdateDebt();
  const { date } = getCurrentDateTime();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      personName: '',
      dueDate: '',
      additionalDetail: '',
      type: debtType || '1',
      date,
      amount: 0,
      description: '',
      accountId: '',
      paymentModeId: '',
      recordType: debtType || '1'
    }
  });

  const watchedType = watch('type');
  const watchedValues = watch();
  const selectedAccount = accounts.find(acc => acc.id === watchedValues.accountId);

  const handleAmountChange = (amount: number) => {
    setValue('amount', amount);
  };
  // Load existing debt data for editing
  useEffect(() => {
    if (isEditing && debt) {
      setValue('personName', debt.personName);
      setValue('dueDate', debt.dueDate);
      setValue('additionalDetail', debt.additionalDetail);
      setValue('type', debt.type);
      setValue('recordType', debt.type);
    }
  }, [isEditing, debt, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const debtData: CreateDebtData = {
        personName: data.personName,
        dueDate: data.dueDate,
        additionalDetail: data.additionalDetail,
        type: data.type,
        record: {
          date: data.date,
          amount: data.amount,
          description: data.description,
          accountId: data.accountId,
          paymentModeId: data.paymentModeId,
          type: data.recordType
        }
      };

      if (isEditing && id) {
        await updateDebt.mutateAsync({ id, data: debtData });
      } else {
        await createDebt.mutateAsync(debtData);
      }
    } catch (error) {
      console.error('Failed to save debt:', error);
    }
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    if (step === 1) {
      navigate('/debts');
    } else {
      setStep(1);
    }
  };

  const isPending = createDebt.isPending || updateDebt.isPending;

  if (isEditing && debtLoading) {
    return <FormLoadingSkeleton />;
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <FormHeader
        title={isEditing ? 'Edit Debt' : step === 1 ? 'Create Debt' : 'Add Initial Transaction'}
        subtitle={
          isEditing
            ? 'Update debt details'
            : step === 1
              ? 'Enter debt information'
              : 'Add the initial transaction for this debt'
        }
        onBack={handleBack}
        backLabel={step === 1 ? 'Back to Debts' : 'Back to Debt Details'}
      />

      {!isEditing && (
        <FormProgressIndicator
          steps={['Debt Details', 'Initial Transaction']}
          currentStep={step}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Step 1: Debt Details */}
        {(step === 1 || isEditing) && (
          <>
            {!isEditing && (
              <FormTypeToggle
                tabs={['Lending', 'Borrowing']}
                activeTab={watchedType === '1' ? 0 : 1}
                onTabChange={(index) => {
                  const newType = index === 0 ? '1' : '2';
                  setValue('type', newType);
                  setValue('recordType', newType);
                }}
                label="Debt Type"
              />
            )}

            <FormSection>
              <FormInput
                label="Person Name"
                id="personName"
                placeholder="Enter person's name"
                register={register('personName', { required: 'Person name is required' })}
                error={errors.personName?.message}
                required
              />
            </FormSection>

            <FormDateTimeFields
              dateValue={watchedValues.dueDate}
              timeValue=""
              onDateChange={(date) => setValue('dueDate', date)}
              onTimeChange={() => {}}
              dateLabel="Due Date"
              dateError={errors.dueDate?.message}
              minDate={new Date().toISOString().split('T')[0]}
              showTime={false}
            />

            <FormSection>
              <FormTextarea
                label="Additional Details"
                id="additionalDetail"
                placeholder="Enter additional details (optional)"
                register={register('additionalDetail')}
                rows={3}
              />
            </FormSection>
          </>
        )}

        {(step === 2 || isEditing) && (
          <>
            <FormSection title="Add Initial Transaction">
              <FormDateTimeFields
                dateValue={watchedValues.date}
                timeValue=""
                onDateChange={(date) => setValue('date', date)}
                onTimeChange={() => {}}
                dateError={errors.date?.message}
                showTime={false}
              />

              <FormAmountField
                register={register('amount', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' }
                })}
                error={errors.amount?.message}
                currentAmount={watchedValues.amount || 0}
                onAmountChange={handleAmountChange}
                showCalculator={false}
              />

              <FormDescriptionField
                register={register('description', { required: 'Description is required' })}
                error={errors.description?.message}
                placeholder="Enter transaction description"
              />

              <FormAccountField
                accounts={accounts}
                selectedAccount={selectedAccount}
                selectedPaymentModeId={watchedValues.paymentModeId}
                onAccountSelect={(account) => {
                  setValue('accountId', account.id);
                  setValue('paymentModeId', '');
                }}
                onPaymentModeSelect={(paymentModeId) => setValue('paymentModeId', paymentModeId)}
                error={errors.accountId?.message}
              />
            </FormSection>
          </>
        )}

        {!isEditing && step === 1 ? (
          <>
            {(createDebt.error || updateDebt.error) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-red-600">
                  Failed to save debt. Please try again.
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-indigo-600 text-white py-2.5 sm:py-3 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm sm:text-base font-medium"
              >
                Next: Add Transaction
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base font-medium"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <FormActions
            onCancel={handleBack}
            submitLabel={isEditing ? 'Update Debt' : 'Create Debt'}
            cancelLabel={step === 1 ? 'Cancel' : 'Back'}
            isPending={isPending}
            error={(createDebt.error || updateDebt.error) ? 'Failed to save debt. Please try again.' : null}
          />
        )}
      </form>
    </div>
  );
}

export default DebtForm;