import { t } from './util';

export const TextInput = (id, label, value, attrs = {}) => {
  return t.div({}, [
    t.label(
      {
        for: id,
        class:
          'tw-block tw-text-sm tw-font-medium tw-leading-6 tw-text-zinc-900',
      },
      label
    ),
    t.div({ class: 'tw-mt-2' }, [
      t.input(
        {
          type: attrs.type || 'text',
          name: attrs.name || 'text',
          id: id,
          value: value || '',
          disabled: attrs.disabled || false,
          class:
            'tw-block tw-w-full tw-rounded-md tw-border-0 tw-text-gray-900 tw-shadow-sm tw-ring-1 tw-ring-gray-300 tw-placeholder:text-gray-400 tw-focus:ring-2 tw-focus:ring-inset tw-focus:ring-indigo-600 tw-disabled:cursor-not-allowed tw-disabled:bg-gray-50 tw-disabled:text-gray-500 tw-disabled:ring-gray-200 tw-sm:text-sm tw-leading-6',
          placeholder: attrs.placeholder || '',
        },
        []
      ),
    ]),
  ]);
};
