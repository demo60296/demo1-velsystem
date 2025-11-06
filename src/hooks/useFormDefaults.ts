import { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { useDefaultCategory } from '../features/categories/hooks/useCategories';
import { useDefaultPaymentMode } from '../features/account/hooks/useAccounts';

interface UseFormDefaultsOptions {
  setValue: UseFormSetValue<any>;
  isEditing: boolean;
  activeTab?: number;
  skipCategory?: boolean;
  skipAccount?: boolean;
}

export function useFormDefaults({
  setValue,
  isEditing,
  activeTab = 0,
  skipCategory = false,
  skipAccount = false
}: UseFormDefaultsOptions) {
  const currentType = activeTab === 0 ? 1 : activeTab === 1 ? 2 : 1;
  const { data: defaultCategory } = useDefaultCategory(currentType);
  const { data: defaultPaymentMode } = useDefaultPaymentMode();

  useEffect(() => {
    if (!isEditing && !skipCategory && defaultCategory && activeTab !== 2) {
      setValue('categoryId', defaultCategory.id);
    }
  }, [defaultCategory, activeTab, isEditing, skipCategory, setValue]);

  useEffect(() => {
    if (!isEditing && !skipAccount && defaultPaymentMode) {
      setValue('accountId', defaultPaymentMode.id);
    }
  }, [defaultPaymentMode, isEditing, skipAccount, setValue]);

  return {
    defaultCategory,
    defaultPaymentMode
  };
}
