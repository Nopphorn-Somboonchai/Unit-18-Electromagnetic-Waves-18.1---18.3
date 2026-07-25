/**
 * @file local-storage.js
 * @description LocalStorage Adapter for persisting student exam results and preferences.
 */

import { APP_CONFIG } from '../../shared/config.js';

export class LocalStorageAdapter {
  /**
   * Save exam result object to LocalStorage
   * @param {Object} result - Exam result data
   * @returns {boolean} Success status
   */
  static saveExamResult(result) {
    try {
      const key = APP_CONFIG.storageKeys.examResult;
      const serialized = JSON.stringify({
        ...result,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.warn('[LocalStorageAdapter] Failed to save exam result:', err);
      return false;
    }
  }

  /**
   * Load last saved exam result from LocalStorage
   * @returns {Object|null} Exam result object or null
   */
  static loadExamResult() {
    try {
      const key = APP_CONFIG.storageKeys.examResult;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.warn('[LocalStorageAdapter] Failed to load exam result:', err);
      return null;
    }
  }

  /**
   * Clear saved exam result from LocalStorage
   * @returns {boolean} Success status
   */
  static clearExamResult() {
    try {
      const key = APP_CONFIG.storageKeys.examResult;
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn('[LocalStorageAdapter] Failed to clear exam result:', err);
      return false;
    }
  }
}
