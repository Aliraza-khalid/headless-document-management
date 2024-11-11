export class Container {
  services: Map<string, any>;

  constructor() {
    this.services = new Map();
  }

  register(name: string, instance: any) {
    this.services.set(name, instance);
  }

  get(name: string) {
    return this.services.get(name);
  }
}

export const ContainerTokens = {
  DocumentRepository: Symbol.for('DocumentRespository'),
  DocumentService: Symbol.for('DocumentService'),
  DocumentController: Symbol.for('DocumentController'),
}
