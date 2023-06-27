import { TextInput } from './TextInput';
import { t } from './util';

export const PropertySection = (property) => {
  return t.div(
    {
      class: 'flex flex-col p-2 gap-2',
    },
    [
      t.h3({ class: 'text-lg font-semibold' }, [('Property: ', property)]),
      TextInput('path', 'Property Path', 'value', { disabled: true }),
      TextInput('path', 'Property Type', 'schema:articleBody', {}),
    ]
  );
};
