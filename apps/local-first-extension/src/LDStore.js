import { PathFactory } from 'ldflex';
import ComunicaEngine from '@ldflex/comunica';
import { namedNode } from '@rdfjs/data-model';
import context from './context.json';
import { constructRequest } from './fetch';

export class LDStore {
  constructor(entryPath, nodeName = '#content') {
    this.entryPath = entryPath;
    this.nodeName = nodeName;
    this.queryEngine = new ComunicaEngine(entryPath);
    this.path = new PathFactory({ context, queryEngine: this.queryEngine });

    this.resource = this.path.create({
      subject: namedNode(entryPath + nodeName),
    });
  }

  async getDocument() {
    const operation = this.resource.document.operation;
    const result = await this.invokeOperation(operation);

    return result;
  }

  async updateDocument(document) {
    const operation = this.resource.document.operation;
    const result = await this.invokeOperation(operation, {}, document);

    return result;
  }

  async invokeOperation(operation, header, body) {
    const operationName = iriName(await operation.type.value);
    console.log('[LdCrdt] Operation: ', operationName);

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

    const response = await constructRequest(href, method, {}, body);
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
