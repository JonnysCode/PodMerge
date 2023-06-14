import { PathFactory } from 'ldflex';
import ComunicaEngine from '@ldflex/comunica';
import { namedNode } from '@rdfjs/data-model';

import context from './context.json';
import { constructRequest } from '../solid/fetch';

export class LDStore {
  constructor(entryPath, nodeName = '#API') {
    this.entryPath = entryPath;
    this.nodeName = nodeName;
    this.queryEngine = new ComunicaEngine(entryPath);
    this.path = new PathFactory({ context, queryEngine: this.queryEngine });

    this.api = this.path.create({
      subject: namedNode(entryPath + nodeName),
    });

    this.docState = this.path.create({
      subject: namedNode(entryPath + '#docState'),
    });

    this.representation = this.path.create({
      subject: namedNode(entryPath + '#hrState'),
    });
  }

  async isCollaborativeResource() {
    const isDesc =
      iriName(await this.api.type.value) === 'CollaborativeResourceDesc';
    console.log('isDesc: ', isDesc);
    return isDesc;
  }

  async log() {
    const docState = await this.docState.type.value;
    const representation = await this.representation.type.value;

    console.log('DocState: ', docState);
    console.log('Representation: ', representation);
  }

  async getFramework() {
    return iriName(await this.docState.framework.value);
  }

  async getDocument() {
    const operation = await getOperationByType(this.api.document, 'Read');
    await logOperation(operation);
    const result = await this.invokeOperation(operation);

    return result;
  }

  async saveDocument(document) {
    const operation = await getOperationByType(this.api.document, 'Update');

    const format = await this.api.document.format.value;

    const header = {
      'Content-Type': format,
    };

    console.log('Header: ', header);

    await logOperation(operation);
    return await this.invokeOperation(operation, header, document);
  }

  async saveJSON(json) {
    const operation = await getOperationByType(
      this.api.representation,
      'Update'
    );

    const header = {
      'Content-Type': 'application/json',
    };

    console.log('Header: ', header);

    await logOperation(operation);
    return await this.invokeOperation(operation, header, json);
  }

  async documentOperations() {
    const operation = await getOperationByType(this.api.document, 'Read');
    console.log('Read Operation');
    await logOperation(operation);
  }

  async invokeOperation(operation, header, body) {
    const operationName = iriName(await operation.type.value);

    switch (operationName) {
      case 'HttpOperation':
        return this.httpOperation(operation, header, body);
      case 'FrameworkOperation':
        return this.frameworkOperation(operation, header, body);
      case 'WorkspaceOperation':
        return this.workspaceOperation(operation, header, body);
      default:
        throw new Error(`Unknown operation: ${operationName}`);
    }
  }

  async httpOperation(operation, header, body) {
    const href = await operation.href.value;
    const method = await operation.method.value;

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

  async workspaceOperation(operation, header, body) {
    // TODO: Implement workspace operations
    console.log(
      '[LdCrdt] Workspace operation: ',
      await operation.operationType.value
    );

    // WorkspaceOperations are Solid data pod specific operations.
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
  return await thing.operation.list();
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
