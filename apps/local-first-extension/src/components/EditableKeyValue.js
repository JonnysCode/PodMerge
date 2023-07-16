import { t } from './util';

export const EditableKeyValue = (id, key, value) => {
  return t.div(
    {
      id: id,
      class:
        'tw-flex tw-flex-row tw-items-center tw-justify-between tw-py-2 tw-border-b tw-border-gray-200',
    },
    [
      t.div(
        {
          class: 'tw-flex tw-flex-row tw-items-center',
        },
        [
          t.div(
            {
              class:
                'tw-flex tw-flex-row tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-full tw-bg-indigo-600 tw-text-white',
            },
            [t.span({}, key[0].toUpperCase())]
          ),
          t.div(
            {
              class: 'tw-ml-2 tw-text-sm tw-font-medium tw-text-gray-900',
            },
            key
          ),
        ]
      ),
      t.div(
        {
          class: 'tw-flex tw-flex-row tw-items-center',
        },
        [
          t.div(
            {
              class: 'tw-text-sm tw-font-medium tw-text-gray-900',
            },
            value
          ),
        ]
      ),
    ]
  );
};
