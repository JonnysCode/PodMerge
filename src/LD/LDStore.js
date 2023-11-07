import { PathFactory } from 'ldflex';
import ComunicaEngine from '@ldflex/comunica';
import { namedNode } from '@rdfjs/data-model';

import context from './data/context.json';
import { constructRequest } from '../solid/fetch';

export class LDStore {
  constructor(entryPath, nodeName = '#description') {
    this.entryPath = entryPath;
    this.nodeName = nodeName;
    this.queryEngine = new ComunicaEngine(entryPath);
    this.path = new PathFactory({ context, queryEngine: this.queryEngine });

    this.description = this.path.create({
      subject: namedNode(entryPath + nodeName),
    });

    this.document = this.path.create({
      subject: namedNode(entryPath + '#document'), // discover at run-time
    });

    this.representation = this.path.create({
      subject: namedNode(entryPath + '#textualRepresentation'), // discover at run-time
    });
  }

  async isCollaborativeResource() {
    const descType = await this.description.type.value;
    console.log('Description type: ', descType);

    return iriName(descType) === 'CollaborativeResourceDescription';
  }

  async log() {
    const docState = await this.document.type.value;
    const representation = await this.representation.type.value;

    console.log('DocState: ', docState);
    console.log('Representation: ', representation);
  }

  async getFramework() {
    return iriName(await this.document.framework.value);
  }

  async getDocument() {
    const operation = await getOperationByType(this.document, 'Read');
    await logOperation(operation);
    const result = await this.invokeOperation(operation);

    return result;
  }

  async saveDocument(document) {
    const operation = await getOperationByType(this.document, 'Update');

    const format = await operation.contentType.value;

    const header = {
      'Content-Type': format,
    };

    console.log('Save document Header: ', header);

    await logOperation(operation);
    return await this.invokeOperation(operation, header, document);
  }

  async saveJSON(json) {
    const operation = await getOperationByType(
      this.description.representation,
      'Update'
    );

    const header = {
      'Content-Type': await operation.contentType.value,
    };

    console.log('Save JSON header: ', header);

    await logOperation(operation);
    return await this.invokeOperation(operation, header, json);
  }

  async invokeOperation(operation, header, body) {
    const operationName = iriName(await operation.type.value);

    switch (operationName) {
      case 'WebOperation':
        return this.webOperation(operation, header, body);
      case 'FrameworkOperation':
        return this.frameworkOperation(operation, header, body);
      default:
        throw new Error(`Unknown operation: ${operationName}`);
    }
  }

  async webOperation(operation, header, body) {
    const href = await operation.href.value;
    const method = await operation.method.value;

    console.log('Web operation: ', href, method, header, body);

    const response = await constructRequest(href, method, header, body);
    console.log('Response: ', response);

    return response;
  }

  async frameworkOperation(operation, header, body) {
    // TODO: Implement framework operations
    console.log(
      '[LdCrdt] Framework operation: ',
      await operation.operationType.value
    );

    // There should be an implementation by the frameworks that provides a uniform interface.
    // It should be simple for the client to invoke the operation based on the metadata from
    // the CRDT ontology.
  }
}

function iriName(namedNodeIRI) {
  // Split the IRI by the last '#' or '/' character
  const lastIndex = namedNodeIRI.lastIndexOf('#');
  const separatorIndex =
    lastIndex !== -1 ? lastIndex : namedNodeIRI.lastIndexOf('/');

  return namedNodeIRI.substring(separatorIndex + 1);
}

async function getOperations(thing) {
  return await thing.operations.list();
}

async function getOperationByType(thing, operationType) {
  const operations = await getOperations(thing);

  for (const operation of operations) {
    const type = iriName(await operation.operationType.value);
    if (type === operationType) {
      console.log('Found operation with type: ', type);
      return operation;
    }
  }
  return null;
}

async function logOperation(operation) {
  const type = iriName(await operation.type.value);
  const method = await operation.method.value;
  const href = await operation.href.value;

  console.log(type, method, href);
}
