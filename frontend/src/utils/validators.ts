/**
 * Utilitários para validação de dados
 */

/**
 * Valida se um número de mesa é válido
 */
export function isValidTableNumber(tableNumber: number): boolean {
  return tableNumber > 0 && tableNumber <= 999;
}

/**
 * Valida se um email é válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se um preço é válido
 */
export function isValidPrice(price: number): boolean {
  return price > 0 && price < 10000;
}

/**
 * Valida se uma quantidade é válida
 */
export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity > 0 && quantity <= 100;
}

/**
 * Valida se uma capacidade de mesa é válida
 */
export function isValidCapacity(capacity: number): boolean {
  return Number.isInteger(capacity) && capacity > 0 && capacity <= 20;
}
