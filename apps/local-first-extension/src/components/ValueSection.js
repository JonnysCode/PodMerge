import { TextInput } from './TextInput';
import { t } from './util';

export const ValueSection = (property, type) => {
  return t.div(
    {
      class: 'tw-flex tw-flex-col tw-mt-4 tw-gap-2',
    },
    [
      t.h3({ class: 'tw-text-lg tw-font-semibold tw-text-gray-800' }, [
        ('Value: ', property),
      ]),
      TextInput('tw-value-data-type', 'Data Type', type, { disabled: true }),
    ]
  );
};
