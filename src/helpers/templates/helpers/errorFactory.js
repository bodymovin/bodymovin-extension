class TemplateError {
  constructor(errors) {
    this.errors = errors || [];
  }
  add(type, message) {
    this.errors.push({
      type,
      message,
    })
    return this;
  }
  getErrors() {
    return this.errors;
  }
  merge = (mergingError) => {
    const mergedTemplateError = new TemplateError(this.getErrors());
    const mergingTemplateErrors = mergingError.getErrors();
    mergingTemplateErrors.forEach(error => mergedTemplateError.add(error.type, error.message));
    return mergedTemplateError;
  }
  concat = (concatenatingTemplatError) => {
    const mergingTemplateErrors = concatenatingTemplatError.getErrors();
    mergingTemplateErrors.forEach(error => this.add(error.type, error.message));
    return this;
  }
  get length() {
    return this.errors.length;
  }
}

const errorFactory = () => {
  return new TemplateError();
}

export default errorFactory;