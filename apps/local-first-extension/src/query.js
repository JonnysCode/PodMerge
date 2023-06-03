import { PathFactory } from 'ldflex';
import ComunicaEngine from '@ldflex/comunica';
import { namedNode } from '@rdfjs/data-model';
import context from './context.json';
import { constructRequest } from './fetch';

const profileCard = 'https://imp.inrupt.net/profile/card';
const blogTtl = 'https://imp.inrupt.net/local-first/blog/context.ttl';

const queryEngine = new ComunicaEngine(blogTtl);
const path = new PathFactory({ context, queryEngine });

const content = path.create({
  subject: namedNode(blogTtl + '#content'),
});

export async function getDocumentOperation() {}

export async function getCRDT() {
  console.log('Content: ', await content);
  console.log('Type: ', await content.type);
  console.log('Type comment: ', await content.type.comment);

  console.log('Document: ', await content.document);
  console.log('Document type: ', await content.document.type);
  console.log('Document format: ', await content.document.format.value);
  console.log(
    'Document operation type: ',
    await content.document.operation.type
  );
  console.log(
    'Document operation method: ',
    await content.document.operation.method.value
  );
  console.log(
    'Document operation href: ',
    await content.document.operation.href.value
  );
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

async function callHttpOperation(operation) {
  const href = await operation.href.value;
  const method = await operation.method.value;

  const response = await constructRequest(href, method);

  console.log('Response: ', response);
}
