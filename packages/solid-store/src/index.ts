type Store = Record<string, any>;

export const store: Store = {
  counter: 0,
};

export const increment = (): void => {
  store.counter++;
};

export const decrement = (): void => {
  store.counter--;
};
