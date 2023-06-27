import { t } from './util';

export const TextInput = (id, label, value, attrs = {}) => {
  return t.div({}, [
    t.label(
      {
        for: id,
        class: 'block text-sm font-medium leading-6 text-zinc-900',
      },
      label
    ),
    t.div({ class: 'mt-2' }, [
      t.input(
        {
          type: attrs.type || 'text',
          name: attrs.name || 'text',
          id: id,
          value: value || '',
          disabled: attrs.disabled || false,
          class:
            'block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6',
          placeholder: attrs.placeholder || '',
        },
        []
      ),
    ]),
  ]);
};
