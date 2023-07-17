import { TextInput } from './TextInput';
import { Check } from './icons/Check';
import { Trash } from './icons/Trash';
import { sidePanel } from '../editor/SidePanel';
import { t } from './util';

export const PropertyContext = (id, property) => {
  return t.div(
    {
      id: id,
      class: 'tw-mt-6',
    },
    [
      t.h2(
        {
          class: 'tw-text-lg tw-font-semibold tw-leading-4 tw-text-gray-900',
        },
        'Property Context'
      ),
      t.p({ class: 'tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-500' }, [
        'This is the context of the ',
        t.span(
          { class: 'tw-font-semibold tw-text-gray-700' },
          `"${property.name}"`
        ),
        ' property. You can update, add, and remove annotations or set a single IRI value.',
      ]),
      t.dl(
        {
          class:
            'tw-mt-3 tw-space-y-3 tw-divide-y tw-divide-gray-200 tw-border-t tw-border-gray-300 tw-text-base tw-leading-3',
        },
        property.context.map((kv, i) =>
          kv.updating
            ? UpdateKeyValueItem(kv.key, kv.value, i)
            : KeyValueItem(kv.key, kv.value, i)
        )
      ),
    ]
  );
};

const KeyValueItem = (key, value, index) => {
  const handleUpdate = () => {
    console.log('handleEdit: ', key, value, index);
    sidePanel.emit('editProperty', [index]);
  };

  return t.div({ class: 'tw-flex tw-flex-row tw-pt-3' }, [
    t.div({ class: 'tw-flex tw-flex-col tw-grow tw-space-y-2' }, [
      t.dt(
        {
          class: 'tw-font-semibold tw-text-gray-900',
        },
        key
      ),
      t.dd(
        {
          class: 'tw-text-gray-900',
        },
        value
      ),
    ]),
    t.button(
      {
        type: 'button',
        class: 'tw-font-semibold tw-text-indigo-600 hover:tw-text-indigo-500',
        click: handleUpdate,
      },
      'Update'
    ),
  ]);
};

const UpdateKeyValueItem = (key, value, index) => {
  const handleUpdate = () => {
    console.log('handleUpdate: ', key, value, index);
    sidePanel.emit('updateProperty', [index]);
  };

  const handleDelete = () => {
    console.log('handleDelete: ', key, value, index);
    sidePanel.emit('deleteProperty', [index]);
  };

  return t.div({ class: 'tw-flex tw-flex-row tw-pt-3 tw-space-x-6' }, [
    t.div({ class: 'tw-flex tw-flex-col tw-grow tw-space-y-2' }, [
      TextInput('update-property', 'Property', key),
      TextInput('update-value', 'Value', value),
    ]),
    t.div({ class: 'tw-flex tw-flex-col tw-justify-center tw-space-y-3' }, [
      t.button(
        {
          type: 'button',
          class:
            'tw-rounded-full tw-bg-gray-500 tw-p-1.5 tw-text-white tw-shadow-sm hover:tw-bg-gray-400 focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-gray-500',
          click: handleDelete,
        },
        Trash('tw-h-4 tw-w-4')
      ),
      t.button(
        {
          type: 'button',
          class:
            'tw-rounded-full tw-bg-indigo-600 tw-p-1.5 tw-text-white tw-shadow-sm hover:tw-bg-indigo-500 focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-indigo-600',
          click: handleUpdate,
        },
        Check('tw-h-4 tw-w-4')
      ),
    ]),
  ]);
};
