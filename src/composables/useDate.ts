import { format } from 'date-fns';

const formatDateSeconds = (seconds: number) => format(new Date(seconds * 1000), 'dd/MM/yyyy');
const getTime = (seconds: number) => format(new Date(seconds * 1000), 'k:m');

export const useDate = () => ({
  formatDateSeconds,
  getTime
});
