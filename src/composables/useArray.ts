const randomInt = (k: number) => Math.floor((k + 1) * Math.random());
const shuffle = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const useArray = () => ({
  shuffle
});
