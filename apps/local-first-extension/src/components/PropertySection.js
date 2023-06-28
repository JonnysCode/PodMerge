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
      class: 'flex flex-col mt-4 gap-2',
    },
    [
      t.h3({ class: 'text-lg font-semibold  text-gray-800' }, [
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
