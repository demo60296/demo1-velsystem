export const getCurrentDateTime = () => ({
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5)
});

export const parseTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return {
    hour: hours,
    minute: minutes,
    second: 0,
    nano: 0
  };
};

export const formatTime = (time: { hour: number; minute: number }) => {
  return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
};

export const getTabIndexFromType = (type: string | number): number => {
  if (type === 1 || type === '1' || type === 'EXPENSE') return 0;
  if (type === 2 || type === '2' || type === 'INCOME') return 1;
  if (type === 3 || type === '3' || type === 'TRANSFER') return 2;
  return 0;
};

export const getTypeFromTabIndex = (tabIndex: number): 1 | 2 | 3 => {
  if (tabIndex === 0) return 1;
  if (tabIndex === 1) return 2;
  return 3;
};
