export class EmailInUseError extends Error {
  constructor() {
    super('The received email is already being used');
    this.name = 'EmailInUseError';
  }
}
