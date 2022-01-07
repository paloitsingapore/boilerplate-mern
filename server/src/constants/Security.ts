import * as argon2 from 'argon2'

/**
 * Options to use for password hashing with argon2
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.htmls
 */
export const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 32768, // 32Mb - use min 15Mb as per OWASP recommendations.
  timeCost: 3, // iterations - use min 2 as per OWASP recommendations.
  parallelism: 1,
}
