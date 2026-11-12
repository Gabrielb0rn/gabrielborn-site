/**
 * Decide se um e-mail é o do administrador.
 *
 * Fica separado do resto da autenticação, sem dependência de servidor, para
 * poder ser testado direto. As regras que importam:
 * - sem ADMIN_EMAIL configurado, ninguém é admin;
 * - a comparação ignora maiúsculas e espaços nas pontas, e nada além disso.
 */
export function isAdminEmail(
  email: string | null | undefined,
  adminEmail: string | null | undefined,
): boolean {
  const expected = adminEmail?.trim().toLowerCase();
  const actual = email?.trim().toLowerCase();
  if (!expected || !actual) return false;
  return actual === expected;
}
