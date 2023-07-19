import { TextInput } from './TextInput';
import { Check } from './icons/Check';
import { Trash } from './icons/Trash';
import { sidePanel } from '../editor/SidePanel';
import { t } from './util';
import { Plus } from './icons/Plus';

const render = (property) => {
  sidePanel.emit('updateTermDefinition', [property]);
};

const updateSimpleTermDefinition = (value) => {};

const updateExtendedTermDefinition = (key, value) => {};

const removeExtendedTermDefinition = (key) => {};

export const TermDefinition = (id, property) => {
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
        'Term Definition'
      ),
      t.p({ class: 'tw-mt-1 tw-text-sm tw-leading-6 tw-text-gray-500' }, [
        'This is the term definition in the context of the ',
        t.span(
          { class: 'tw-font-semibold tw-text-gray-700' },
          `"${property.name}"`
        ),
        ' property. You can choose between a simple and extended term definition which allows you to update, add, and remove definitions.',
      ]),
      property.isExpandedTermDefinition
        ? ExtendedTermDefinition('extended-term-definition', property)
        : SimpleTermDefinition('simple-term-definition', property),
    ]
  );
};

const SimpleTermDefinition = (id, property) => {
  return t.div({ id: id }, [
    t.div(
      {
        class:
          'tw-flex tw-flex-row tw-space-x-3 tw-content-center tw-text-center tw-border-t tw-border-gray-300 tw-text-gray-400 tw-text-base tw-font-semibold tw-my-3',
      },
      [
        t.button(
          {
            class:
              'tw-py-1 tw-basis-1/2 tw-text-emerald-600 tw-border-2 tw-border-emerald-600 tw-rounded-lg tw-mt-3',
          },
          'Simple'
        ),
        t.button(
          {
            class:
              'tw-py-1 tw-basis-1/2 tw-border-2 tw-border-gray-400 tw-rounded-lg tw-mt-3 hover:tw-bg-gray-400 hover:tw-text-white',
            click: () => {
              property.isExpandedTermDefinition = true;
              render(property);
            },
          },
          'Extended'
        ),
      ]
    ),
    t.dl(
      {
        class:
          'tw-mt-3 tw-space-y-3 tw-divide-y tw-divide-gray-200 tw-border-t tw-border-gray-300 tw-text-base tw-leading-3',
      },
      hasTermDefinition(property) && !isUpdating(property)
        ? ValueItem(property)
        : UpdateValueItem(property)
    ),
  ]);
};

const hasTermDefinition = (property) => {
  return (
    Object.hasOwn(property.termDefinition, 'value') &&
    Object.hasOwn(property.termDefinition, 'updating')
  );
};

const isUpdating = (property) => {
  return property.termDefinition.updating;
};

const ExtendedTermDefinition = (id, property) => {
  return t.div({ id: id }, [
    t.div(
      {
        class:
          'tw-flex tw-flex-row tw-space-x-3 tw-content-center tw-text-center tw-border-t tw-border-gray-300 tw-text-gray-400 tw-text-base tw-font-semibold tw-my-3',
      },
      [
        t.button(
          {
            class:
              'tw-py-1 tw-basis-1/2 tw-border-2 tw-border-gray-400 tw-rounded-lg tw-mt-3 hover:tw-bg-gray-400 hover:tw-text-white',
            click: () => {
              property.isExpandedTermDefinition = false;
              render(property);
            },
          },
          'Simple'
        ),
        t.button(
          {
            class:
              'tw-py-1 tw-basis-1/2 tw-text-emerald-600 tw-border-2 tw-border-emerald-600 tw-rounded-lg tw-mt-3',
          },
          'Extended'
        ),
      ]
    ),
    t.dl(
      {
        class:
          'tw-mt-3 tw-space-y-3 tw-divide-y tw-divide-gray-200 tw-border-t tw-border-gray-300 tw-text-base tw-leading-3',
      },
      [
        ...property.termDefinition.map((kv, i) =>
          kv.updating
            ? UpdateKeyValueItem(property, i)
            : KeyValueItem(kv.key, kv.value, i)
        ),
        t.div(
          {
            class:
              'tw-flex tw-flex-row tw-items-center tw-justify-center tw-pt-3 tw-text-gray-400 tw-text-base tw-font-semibold hover:tw-text-gray-300',
            click: () => {
              property.termDefinition.push({
                key: '',
                value: '',
                updating: true,
              });
              render(property);
            },
          },
          [
            Plus(
              'tw-w-7 tw-h-7 tw-mr-2 tw-text-emerald-600 hover:tw-text-emerald-500'
            ),
            'Add entry',
          ]
        ),
      ]
    ),
  ]);
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
        class: 'tw-font-semibold tw-text-emerald-600 hover:tw-text-emerald-500',
        click: handleUpdate,
      },
      'Update'
    ),
  ]);
};

const ValueItem = (property) => {
  const value = property.termDefinition.value || '';

  const handleUpdate = () => {
    property.termDefinition.updating = true;
    render(property);
  };

  return t.div({ class: 'tw-flex tw-flex-row tw-pt-3' }, [
    t.div({ class: 'tw-flex tw-flex-col tw-grow tw-space-y-1' }, [
      t.dt(
        {
          class: 'tw-text-gray-900 tw-text-sm',
        },
        'value'
      ),
      t.dd(
        {
          class: 'tw-font-semibold tw-text-gray-900',
        },
        value
      ),
    ]),
    t.button(
      {
        type: 'button',
        class: 'tw-font-semibold tw-text-emerald-600 hover:tw-text-emerald-500',
        click: handleUpdate,
      },
      'Update'
    ),
  ]);
};

const UpdateKeyValueItem = (property, index) => {
  const keyId = 'update-key';
  const valueId = 'update-value';

  const key = property.termDefinition[index].key;
  const value = property.termDefinition[index].value;

  const handleUpdate = () => {
    property.termDefinition[index].updating = false;
    property.termDefinition[index].key = getValueOfInput(keyId);
    property.termDefinition[index].value = getValueOfInput(valueId);
    console.log('handle term Update: ', property.termDefinition[index]);
    render(property);
  };

  const handleDelete = () => {
    property.termDefinition.splice(index, 1);
    render(property);
  };

  return t.div({ class: 'tw-flex tw-flex-row tw-pt-3 tw-space-x-6' }, [
    t.div({ class: 'tw-flex tw-flex-col tw-grow tw-space-y-2' }, [
      TextInput(keyId, 'Key', key),
      TextInput(valueId, 'Value', value),
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
            'tw-rounded-full tw-bg-emerald-600 tw-p-1.5 tw-text-white tw-shadow-sm hover:tw-bg-emerald-500 focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-emerald-600',
          click: handleUpdate,
        },
        Check('tw-h-4 tw-w-4')
      ),
    ]),
  ]);
};

const UpdateValueItem = (property) => {
  const valueId = 'update-value';

  const value = property.termDefinition.value || '';

  const handleUpdate = () => {
    property.termDefinition.updating = false;
    property.termDefinition.value = getValueOfInput(valueId);
    render(property);
  };

  return t.div({ class: 'tw-flex tw-flex-row tw-pt-3 tw-space-x-6' }, [
    t.div({ class: 'tw-flex tw-flex-col tw-grow tw-space-y-2' }, [
      TextInput(valueId, 'value', value),
    ]),
    t.div({ class: 'tw-flex tw-flex-col tw-justify-center tw-space-y-3' }, [
      t.button(
        {
          type: 'button',
          class:
            'tw-rounded-full tw-bg-emerald-600 tw-p-1.5 tw-text-white tw-shadow-sm hover:tw-bg-emerald-500 focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-emerald-600',
          click: handleUpdate,
        },
        Check('tw-h-4 tw-w-4')
      ),
    ]),
  ]);
};

const getValueOfInput = (id) => {
  const input = document.getElementById(id);
  return input.value;
};
