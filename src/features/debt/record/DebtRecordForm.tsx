import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  useCreatePaidDebtTransaction,
  useCreateReceivedDebtTransaction,
  useUpdatePaidDebtTransaction,
  useUpdateReceivedDebtTransaction,
  useDebtRecord
} from '../../../hooks/useDebts';
import { useAccounts } from '../../account/hooks/useAccounts';
import { CreateDebtRecordData } from '../types/debt';
import FormHeader from '../../../components/forms/FormHeader';
import FormDateTimeFields from '../../../components/forms/FormDateTimeFields';
import FormAmountField from '../../../components/forms/FormAmountField';
import FormDescriptionField from '../../../components/forms/FormDescriptionField';
import FormAccountField from '../../../components/forms/FormAccountField';
import FormActions from '../../../components/forms/FormActions';
import FormLoadingSkeleton from '../../../components/forms/FormLoadingSkeleton';
import FormTypeToggle from '../../../components/forms/FormTypeToggle';
import { useFormDefaults } from '../../../hooks/useFormDefaults';
import { parseTime, formatTime, getCurrentDateTime } from '../../../utils/formUtils';

interface FormData {
  date: string;
  time: string;
  amount: number;
  description: string;
  accountId: string;
  paymentModeId?: string;
  type: '1' | '2';
}

function DebtRecordForm() {
  const { debtId, recordId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(recordId);
  const recordType = location.state?.recordType as '1' | '2' | undefined;

  const { data: record, isLoading: recordLoading } = useDebtRecord(recordId || '');
  const { data: accounts = [] } = useAccounts();
  
  // Use appropriate mutation based on record type
  const createPaidRecord = useCreatePaidDebtTransaction();
  const createReceivedRecord = useCreateReceivedDebtTransaction();
  const updatePaidRecord = useUpdatePaidDebtTransaction();
  const updateReceivedRecord = useUpdateReceivedDebtTransaction();
  
  const { date, time } = getCurrentDateTime();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      date,
      time,
      amount: 0,
      description: '',
      accountId: '',
      paymentModeId: '',
      type: recordType || '1'
    }
  });

  const watchedValues = watch();
  const selectedAccount = accounts.find(acc => acc.id === watchedValues.accountId);

  const handleAmountChange = (amount: number) => {
    setValue('amount', amount);
  };

  useFormDefaults({
    setValue,
    isEditing,
    skipCategory: true
  });

  useEffect(() => {
    if (isEditing && record) {
      setValue('date', record.date);
      if (record.time) {
        setValue('time', formatTime(record.time));
      }
      setValue('amount', record.amount);
      setValue('description', record.description);
      setValue('accountId', record.accountId);
      setValue('paymentModeId', record.paymentModeId || '');
      setValue('type', record.type);
    }
  }, [isEditing, record, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const recordData: CreateDebtRecordData = {
        date: data.date,
        time: parseTime(data.time),
        amount: data.amount,
        description: data.description,
        accountId: data.accountId,
        paymentModeId: data.paymentModeId,
        type: data.type
      };

      if (isEditing && recordId) {
        // Use appropriate update mutation based on record type
        if (data.type === '1') {
          await updatePaidRecord.mutateAsync({ id: recordId, data: recordData });
        } else {
          await updateReceivedRecord.mutateAsync({ id: recordId, data: recordData });
        }
      } else if (debtId) {
        // Use appropriate create mutation based on record type
        if (data.type === '1') {
          await createPaidRecord.mutateAsync({ debtId, data: recordData });
        } else {
          await createReceivedRecord.mutateAsync({ debtId, data: recordData });
        }
      }

      navigate(`/debts/${debtId}/records`);
    } catch (error) {
      console.error('Failed to save record:', error);
    }
  };

  const isPending = createPaidRecord.isPending || createReceivedRecord.isPending ||
                   updatePaidRecord.isPending || updateReceivedRecord.isPending;

  if (isEditing && recordLoading) {
    return <FormLoadingSkeleton />;
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <FormHeader
        title={isEditing ? 'Edit Record' : 'Add Record'}
        subtitle={isEditing ? 'Update record details' : 'Add a new debt record'}
        onBack={() => navigate(`/debts/${debtId}/records`)}
        backLabel="Back to Records"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {!isEditing && (
          <FormTypeToggle
            tabs={['Money Paid', 'Money Received']}
            activeTab={watchedValues.type === '1' ? 0 : 1}
            onTabChange={(index) => setValue('type', index === 0 ? '1' : '2')}
            label="Record Type"
          />
        )}

        <FormDateTimeFields
          dateValue={watchedValues.date}
          timeValue={watchedValues.time}
          onDateChange={(date) => setValue('date', date)}
          onTimeChange={(time) => setValue('time', time)}
          dateError={errors.date?.message}
          timeError={errors.time?.message}
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
          placeholder="Enter record description"
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

        <FormActions
          onCancel={() => navigate(`/debts/${debtId}/records`)}
          submitLabel={isEditing ? 'Update Record' : 'Create Record'}
          isPending={isPending}
          error={(createPaidRecord.error || createReceivedRecord.error || updatePaidRecord.error || updateReceivedRecord.error) ? 'Failed to save record. Please try again.' : null}
        />
      </form>
    </div>
  );
}

export default DebtRecordForm;