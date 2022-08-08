import { format } from 'date-fns';

const formatDateSeconds = (seconds: number) => format(new Date(seconds * 1000), 'dd/MM/yyyy');

export const useDate = () => ({
  formatDateSeconds
});
