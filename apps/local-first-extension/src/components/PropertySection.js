import { TextInput } from './TextInput';
import { t } from './util';

const initialProperty = {
  name: 'articleBody',
  context: {
    '@type': '@id',
    '@id': 'schema:articleBody',
  },
};

export const PropertySection = (id, property) => {
  property = initialProperty;
  return t.div(
    {
      id: id,
      class: 'tw-flex tw-flex-col tw-mt-4 tw-gap-2',
    },
    [
      t.h3({ class: 'tw-text-lg tw-font-semibold  tw-text-gray-800' }, [
        'Property "',
        property.name,
        '" context',
      ]),
      ...Object.keys(property.context).map((key) => {
        return TextInput(key, key, property.context[key]);
      }),
    ]
  );
};
