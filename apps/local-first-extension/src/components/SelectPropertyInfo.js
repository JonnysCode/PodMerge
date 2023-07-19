import { t } from './util';

export const SelectPropertyInfo = (id) => {
  return t.p(
    {
      id: id,
      class: 'tw-text-lg tw-pt-6 tw-text-gray-500 tw-italic tw-text-center',
    },
    'Select an editable element in the webpage to see its term definition.'
  );
};
