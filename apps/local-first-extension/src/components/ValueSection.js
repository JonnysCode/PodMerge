import { TextInput } from './TextInput';
import { t } from './util';

export const ValueSection = (property, type) => {
  return t.div(
    {
      class: 'flex flex-col mt-4 gap-2',
    },
    [
      t.h3({ class: 'text-lg font-semibold text-gray-800' }, [
        ('Value: ', property),
      ]),
      TextInput('value-data-type', 'Data Type', type, { disabled: true }),
    ]
  );
};
