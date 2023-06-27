import { TextInput } from './TextInput';
import { t } from './util';

export const ValueSection = (property, type) => {
  return t.div(
    {
      class: 'flex flex-col p-2 gap-2',
    },
    [
      t.h3({ class: 'text-lg font-semibold' }, [('Value: ', property)]),
      TextInput('value-data-type', 'Data Type', type, { disabled: true }),
    ]
  );
};
