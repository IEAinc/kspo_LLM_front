import { useCallback, useState } from 'react';

const INITIAL_STATE = {
  isOpen: false,
  title: '',
  iconMode: 'warn',
  message: '',
  confirmButton: null,
  cancelButton: null,
  onConfirm: undefined,
  onCancel: undefined,
};

const useAdminAlert = () => {
  const [alertState, setAlertState] = useState(INITIAL_STATE);

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showAlert = useCallback((options = {}) => {
    setAlertState({
      ...INITIAL_STATE,
      ...options,
      isOpen: true,
      confirmButton: options.confirmButton ?? { text: '확인', colorMode: true },
    });
  }, []);

  return { alertState, showAlert, hideAlert };
};

export default useAdminAlert;

