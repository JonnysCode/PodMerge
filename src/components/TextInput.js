import { t } from './util';

export const TextInput = (id, label, value, attrs = {}) => {
  return t.div({}, [
    t.label(
      {
        for: id,
        class:
          'tw-block tw-ml-1 tw-text-sm tw-font-medium tw-leading-3 tw-text-zinc-900',
      },
      label
    ),
    t.div({ class: 'tw-mt-1' }, [
      t.input(
        {
          type: attrs.type || 'text',
          name: attrs.name || 'text',
          id: id,
          value: value || '',
          disabled: attrs.disabled || false,
          class:
            'tw-block tw-w-full tw-rounded-md tw-border-0 tw-text-gray-900 tw-shadow-sm tw-ring-1 tw-ring-gray-300 placeholder:tw-text-gray-400 focus:tw-ring-2 focus:tw-ring-inset focus:tw-ring-emerald-600 disabled:tw-cursor-not-allowed disabled:tw-bg-gray-50 disabled:tw-text-gray-500 disabled:tw-ring-gray-200 tw-leading-6',
          placeholder: attrs.placeholder || '',
        },
        []
      ),
    ]),
  ]);
};
