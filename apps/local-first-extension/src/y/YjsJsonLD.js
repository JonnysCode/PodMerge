import { JsonLD } from '../LD/JsonLd';

class YjsJsonLD extends JsonLD {
  constructor(jsonld, PRIVATE_CONSTRUCTOR_KEY) {
    super(jsonld, PRIVATE_CONSTRUCTOR_KEY);
  }

  static create(jsonld) {
    return super.fromJson(jsonld);
  }

  static fromJson(json, url = null) {
    return super.fromJson(jsonld);
  }

  static fromYStore(store, url = null) {
    return super.fromYStore(store, url);
  }
}
