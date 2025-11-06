import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  useCreateTransaction,
  useUpdateTransaction,
  useTransaction
} from './hooks/useTransactions';
import {
  useCategoriesByType
} from '../categories/hooks/useCategories';
import {
  useAccounts
} from '../account/hooks/useAccounts';
import { CreateTransactionData } from './types/transaction';
import CategorySelectModal from '../../components/CategorySelectModal';
import AccountSelectModal from '../../components/AccountSelectModal';
import AccountDisplay from '../account/components/AccountDisplay';
import PaymentModeSelector from '../../components/account/PaymentModeSelector';
import TransferAccountSection from '../../components/account/TransferAccountSection';
import FormHeader from '../../components/forms/FormHeader';
import FormDateTimeFields from '../../components/forms/FormDateTimeFields';
import FormAmountField from '../../components/forms/FormAmountField';
import FormDescriptionField from '../../components/forms/FormDescriptionField';
import FormTagsField from '../../components/forms/FormTagsField';
import FormActions from '../../components/forms/FormActions';
import FormLoadingSkeleton from '../../components/forms/FormLoadingSkeleton';
import FormTypeToggle from '../../components/forms/FormTypeToggle';
import FormCategorySelector from '../../components/forms/FormCategorySelector';
import FormSelectableItem from '../../components/forms/FormSelectableItem';
import { useFormDefaults } from '../../hooks/useFormDefaults';
import { getTabIndexFromType, getTypeFromTabIndex, getCurrentDateTime } from '../../utils/formUtils';

const tabs = ['Expense', 'Income', 'Transfer'];

interface FormData {
  type: 1 | 2 | 3;
  date: string;
  time: string;
  amount: number;
  categoryId?: string;
  accountId: string;
  fromAccountId?: string;
  toAccountId?: string;
  paymentModeId?: string;
  fromPaymentModeId?: string;
  toPaymentModeId?: string;
  description: string;
  tags: string[];
}

function TransactionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const defaultTags = ['vacation', 'needs', 'business', 'food', 'shopping', 'entertainment', 'health', 'transportation'];
  const [activeTab, setActiveTab] = useState(0);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isToAccountModalOpen, setIsToAccountModalOpen] = useState(false);
  const [isFromAccountModalOpen, setIsFromAccountModalOpen] = useState(false);

  const { data: transaction, isLoading: transactionLoading } = useTransaction(id || '');
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  const currentType = activeTab === 0 ? 1 : activeTab === 1 ? 2 : 1;
  const { data: categories = [] } = useCategoriesByType(currentType);
  const { data: accounts = [] } = useAccounts();

  const { date, time } = getCurrentDateTime();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      type: 1,
      date,
      time,
      amount: 0,
      categoryId: '',
      accountId: '',
      toAccountId: '',
      fromAccountId: '',
      paymentModeId: '',
      fromPaymentModeId: '',
      toPaymentModeId: '',
      description: '',
      tags: []
    }
  });

  const watchedValues = watch();
  const selectedCategory = categories.find(cat => cat.id === watchedValues.categoryId);
  const selectedAccount = accounts.find(acc => acc.id === watchedValues.accountId);
  const selectedToAccount = accounts.find(acc => acc.id === watchedValues.toAccountId);
  const selectedPaymentMode = selectedAccount?.linkedPaymentModes?.find(pm => pm.id === watchedValues.paymentModeId);

  useFormDefaults({
    setValue,
    isEditing,
    activeTab
  });

  useEffect(() => {
    if (isEditing && transaction) {
      setActiveTab(getTabIndexFromType(transaction.type));
      setValue('type', transactionType);
      setValue('date', transaction.txnDate);
      setValue('time', transaction.txnTime.slice(0, 5)); // Remove seconds
      setValue('amount', transaction.amount);
      setValue('categoryId', transaction.category?.id || '');
      setValue('accountId', transaction.account?.id || '');
      setValue('toAccountId', transaction.toAccount?.id || '');
      setValue('fromAccountId', transaction.fromAccount?.id || '');
      setValue('paymentModeId', transaction.paymentMode?.id || '');
      setValue('description', transaction.description);
      setValue('tags', transaction.tags?.map(tag => tag.name) || []);
    }
  }, [isEditing, transaction, setValue]);

  useEffect(() => {
    setValue('type', getTypeFromTabIndex(activeTab));
    if (activeTab === 2) {
      setValue('categoryId', '');
    }
  }, [activeTab, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const transactionData: CreateTransactionData = {
        type: data.type,
        txnDate: data.date,
        txnTime: data.time,
        amount: data.amount,
        categoryId: data.type === 3 ? undefined : data.categoryId,
        accountId: data.accountId,
        toAccountId: data.type === 3 ? data.toAccountId : undefined,
        paymentModeId: data.type === 3 ? data.fromPaymentModeId : data.paymentModeId,
        toPaymentModeId: data.type === 3 ? data.toPaymentModeId : undefined,
        description: data.description,
        tags: data.tags
      };

      const transactionType = data.type === 1 ? 'expense' : data.type === 2 ? 'income' : 'transfer';

      if (isEditing && id) {
        await updateTransaction.mutateAsync({
          id,
          data: transactionData,
          transactionType
        });
      } else {
        await createTransaction.mutateAsync({
          ...transactionData,
          transactionType
        });
      }
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const handleAmountChange = (amount: number) => {
    setValue('amount', amount);
  };

  const isPending = createTransaction.isPending || updateTransaction.isPending;

  if (isEditing && transactionLoading) {
    return <FormLoadingSkeleton />;
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <FormHeader
        title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
        subtitle={isEditing ? 'Update transaction details' : 'Record a new financial transaction'}
        onBack={() => navigate('/transactions')}
        backLabel="Back to Transactions"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 lg:space-y-8">
        <FormTypeToggle
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          label="Transaction Type"
        />

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
        />

        {activeTab !== 2 && (
          <FormCategorySelector
            selectedCategory={selectedCategory}
            onChangeClick={() => setIsCategoryModalOpen(true)}
            error={errors.categoryId?.message}
          />
        )}

        {activeTab !== 2 && (
          <FormSelectableItem
            label="Account"
            onChangeClick={() => setIsAccountModalOpen(true)}
            error={errors.accountId?.message}
          >
            {selectedAccount ? (
              <div className="space-y-2 sm:space-y-3">
                <AccountDisplay account={selectedAccount} />

                {selectedAccount.linkedPaymentModes && selectedAccount.linkedPaymentModes.length > 0 && (
                  <PaymentModeSelector
                    paymentModes={selectedAccount.linkedPaymentModes}
                    selectedPaymentModeId={watchedValues.paymentModeId}
                    onSelect={(paymentModeId) => setValue('paymentModeId', paymentModeId)}
                  />
                )}
              </div>
            ) : (
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg text-xs sm:text-sm text-gray-500">
                No account selected
              </div>
            )}
          </FormSelectableItem>
        )}

        {/* Transfer Accounts */}
        {activeTab === 2 && (
          <div className="space-y-4 sm:space-y-6">
            <TransferAccountSection
              type="from"
              account={selectedAccount}
              selectedPaymentModeId={watchedValues.fromPaymentModeId}
              onAccountChange={() => setIsFromAccountModalOpen(true)}
              onPaymentModeSelect={(paymentModeId) => setValue('fromPaymentModeId', paymentModeId)}
            />

            <TransferAccountSection
              type="to"
              account={selectedToAccount}
              selectedPaymentModeId={watchedValues.toPaymentModeId}
              onAccountChange={() => setIsToAccountModalOpen(true)}
              onPaymentModeSelect={(paymentModeId) => setValue('toPaymentModeId', paymentModeId)}
            />
          </div>
        )}

        <FormDescriptionField
          register={register('description', { required: 'Description is required' })}
          error={errors.description?.message}
          placeholder="Enter transaction description"
        />

        <FormTagsField
          tags={watchedValues.tags}
          onTagsChange={(tags) => setValue('tags', tags)}
          defaultTags={defaultTags}
        />

        <FormActions
          onCancel={() => navigate('/transactions')}
          submitLabel={isEditing ? 'Update Transaction' : 'Create Transaction'}
          isPending={isPending}
          error={(createTransaction.error || updateTransaction.error) ? 'Failed to save transaction. Please try again.' : null}
        />
      </form>

      <CategorySelectModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSelect={(category) => setValue('categoryId', category.id)}
        selectedCategory={selectedCategory}
        title={`Select ${tabs[activeTab]} Category`}
      />

      <AccountSelectModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        accounts={accounts}
        onSelect={(account) => {
          setValue('accountId', account.id);
          setValue('paymentModeId', '');
        }}
        onPaymentModeSelect={(paymentModeId) => setValue('paymentModeId', paymentModeId)}
        selectedAccount={selectedAccount}
        selectedPaymentModeId={watchedValues.paymentModeId}
        title="Select Account"
        showPaymentModes={true}
      />

      <AccountSelectModal
        isOpen={isFromAccountModalOpen}
        onClose={() => setIsFromAccountModalOpen(false)}
        accounts={accounts}
        onSelect={(account) => {
          setValue('accountId', account.id);
          setValue('fromPaymentModeId', '');
        }}
        onPaymentModeSelect={(paymentModeId) => setValue('fromPaymentModeId', paymentModeId)}
        selectedAccount={selectedAccount}
        selectedPaymentModeId={watchedValues.fromPaymentModeId}
        title="Select From Account"
        showPaymentModes={true}
      />

      <AccountSelectModal
        isOpen={isToAccountModalOpen}
        onClose={() => setIsToAccountModalOpen(false)}
        accounts={accounts}
        onSelect={(account) => {
          setValue('toAccountId', account.id);
          setValue('toPaymentModeId', '');
        }}
        onPaymentModeSelect={(paymentModeId) => setValue('toPaymentModeId', paymentModeId)}
        selectedAccount={selectedToAccount}
        selectedPaymentModeId={watchedValues.toPaymentModeId}
        title="Select Destination Account"
        excludeAccountId={watchedValues.accountId}
        showPaymentModes={true}
      />
    </div>
  );
}

export default TransactionForm;