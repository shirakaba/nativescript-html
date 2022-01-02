export class DOMException implements DOMException {
  constructor(
    readonly message: string = "",
    readonly name: string = "Error",
  ){}
  get code(): number {
    switch(this.name){
      case "INDEX_SIZE_ERR": return this.INDEX_SIZE_ERR;
      case "DOMSTRING_SIZE_ERR": return this.DOMSTRING_SIZE_ERR;
      case "HIERARCHY_REQUEST_ERR": return this.HIERARCHY_REQUEST_ERR;
      case "WRONG_DOCUMENT_ERR": return this.WRONG_DOCUMENT_ERR;
      case "INVALID_CHARACTER_ERR": return this.INVALID_CHARACTER_ERR;
      case "NO_DATA_ALLOWED_ERR": return this.NO_DATA_ALLOWED_ERR;
      case "NO_MODIFICATION_ALLOWED_ERR": return this.NO_MODIFICATION_ALLOWED_ERR;
      case "NOT_FOUND_ERR": return this.NOT_FOUND_ERR;
      case "NOT_SUPPORTED_ERR": return this.NOT_SUPPORTED_ERR;
      case "INUSE_ATTRIBUTE_ERR": return this.INUSE_ATTRIBUTE_ERR;
      case "INVALID_STATE_ERR": return this.INVALID_STATE_ERR;
      case "SYNTAX_ERR": return this.SYNTAX_ERR;
      case "INVALID_MODIFICATION_ERR": return this.INVALID_MODIFICATION_ERR;
      case "NAMESPACE_ERR": return this.NAMESPACE_ERR;
      case "INVALID_ACCESS_ERR": return this.INVALID_ACCESS_ERR;
      case "VALIDATION_ERR": return this.VALIDATION_ERR;
      case "TYPE_MISMATCH_ERR": return this.TYPE_MISMATCH_ERR;
      case "SECURITY_ERR": return this.SECURITY_ERR;
      case "NETWORK_ERR": return this.NETWORK_ERR;
      case "ABORT_ERR": return this.ABORT_ERR;
      case "URL_MISMATCH_ERR": return this.URL_MISMATCH_ERR;
      case "QUOTA_EXCEEDED_ERR": return this.QUOTA_EXCEEDED_ERR;
      case "TIMEOUT_ERR": return this.TIMEOUT_ERR;
      case "INVALID_NODE_TYPE_ERR": return this.INVALID_NODE_TYPE_ERR;
      case "DATA_CLONE_ERR": return this.DATA_CLONE_ERR;
      default: return 0;
    }
  }
  INDEX_SIZE_ERR = 1;
  DOMSTRING_SIZE_ERR = 2;
  HIERARCHY_REQUEST_ERR = 3;
  WRONG_DOCUMENT_ERR = 4;
  INVALID_CHARACTER_ERR = 5;
  NO_DATA_ALLOWED_ERR = 6;
  NO_MODIFICATION_ALLOWED_ERR = 7;
  NOT_FOUND_ERR = 8;
  NOT_SUPPORTED_ERR = 9;
  INUSE_ATTRIBUTE_ERR = 10;
  INVALID_STATE_ERR = 11;
  SYNTAX_ERR = 12;
  INVALID_MODIFICATION_ERR = 13;
  NAMESPACE_ERR = 14;
  INVALID_ACCESS_ERR = 15;
  VALIDATION_ERR = 16;
  TYPE_MISMATCH_ERR = 17;
  SECURITY_ERR = 18;
  NETWORK_ERR = 19;
  ABORT_ERR = 20;
  URL_MISMATCH_ERR = 21;
  QUOTA_EXCEEDED_ERR = 22;
  TIMEOUT_ERR = 23;
  INVALID_NODE_TYPE_ERR = 24;
  DATA_CLONE_ERR = 25;
  stack?: string | undefined;
}