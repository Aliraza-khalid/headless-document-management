export const ContainerTokens = {
  DB: Symbol.for('DB'),

  DocumentRepository: Symbol.for('DocumentRespository'),
  DocumentService: Symbol.for('DocumentService'),
  DocumentController: Symbol.for('DocumentController'),

  UserRepository: Symbol.for('UserRespository'),
  UserService: Symbol.for('UserService'),
  UserController: Symbol.for('UserController'),

  HashService: Symbol.for('HashService'),
  AuthService: Symbol.for('AuthService'),
  AuthController: Symbol.for('AuthController'),
}
