export enum PasswordErrors {
  NO_PASSWORD_GIVEN = 1,
  INVALID_PASSWORD = 2
}

export const supportedPasswordErrorCode: number[] = Object.values((error: PasswordErrors) => error.valueOf());

export const passwordTranslationMapping = {
  [PasswordErrors.NO_PASSWORD_GIVEN]: "product.errors.no_password",
  [PasswordErrors.INVALID_PASSWORD]: "product.errors.incorrect_password",
}
