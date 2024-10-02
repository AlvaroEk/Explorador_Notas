// src/utils.ts

import { v4 as uuidv4 } from 'uuid';

/**
 * Genera un identificador único utilizando UUID v4.
 * @returns {string} Un UUID v4 como cadena de texto.
 */
export const generateId = (): string => uuidv4();
