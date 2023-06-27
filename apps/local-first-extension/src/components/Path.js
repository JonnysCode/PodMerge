import { t } from './util';

export const Path = (path) => {
  return t.div(
    {
      class: 'flex flex-row p-2 gap-2 bg-green-100',
    },
    [
      ...path.map((element) => {
        return t.div(
          {
            class: 'flex flex-row p-2 gap-2',
          },
          [t.span({ class: 'text-lg font-semibold' }, [element])]
        );
      }),
    ]
  );
};
