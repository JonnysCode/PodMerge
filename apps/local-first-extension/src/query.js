import { PathFactory } from 'ldflex';
import ComunicaEngine from '@ldflex/comunica';
import { namedNode } from '@rdfjs/data-model';
import context from './context.json';

const profileCard = 'https://imp.inrupt.net/profile/card';
const blogTtl = 'https://imp.inrupt.net/local-first/blog/context.ttl';

const queryEngine = new ComunicaEngine(blogTtl);
const path = new PathFactory({ context, queryEngine });

const content = path.create({
  subject: namedNode(blogTtl + '#content'),
});

console.log('Content namespace: ', content.namespace);
console.log('Content fragment: ', content.fragment);

export async function getCRDT() {
  console.log('Content: ', await content);
  console.log('Type: ', await content.type);
  console.log('Type comment: ', await content.type.comment);

  console.log('Document: ', await content.document);
  console.log('Document type: ', await content.document.type);
  console.log('Document format: ', await content.document.format.value);
  console.log('Document operation: ', await content.document.operation);


  console.log(`The label is ${await content.label}`);
  console.log(`The name is ${await content.name}`);
}

export async function showPerson() {
  const queryEngine = new ComunicaEngine(profileCard);
  const path = new PathFactory({ context, queryEngine });

  const person = path.create({
    subject: namedNode(profileCard + '#me'),
  });

  console.log(`This person is ${await person.name}`);
  console.log(`Issuer: ${await person.oidcIssuer}`);

  console.log('Trusted apps:');
  for await (const origin of person.trustedApp.origin)
    console.log(`- ${origin}`);
}
