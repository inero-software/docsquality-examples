import {HttpErrorResponse} from "@angular/common/http";



export function getErrorMessage(err: HttpErrorResponse): any {
  const error = err.error;
  const errors = error?.errors;

  if (!!errors && errors.length > 0) {
    return errors[0].defaultMessage;
  }

  return error.message ? error.message : error.errorMessage;
}

