// src/utils/settingsCache.js
import { useState, useEffect } from 'react';
import { getGeneralSettings } from '../services/api/apiSettingsService';

const SETTINGS_STORAGE_KEY = 'medcare_practice_settings';
const SETTINGS_EVENT = 'medcare_settings_updated';

const DEFAULT_SETTINGS = {
  appName: 'F&M Health & Wellness',
  practiceName: 'F&M Health & Wellness Center LLC',
  practiceType: 'MULTI_SPECIALTY',
  timezone: 'America/Chicago',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12H',
  language: 'en-US'
};

const getStoredLocalSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_SETTINGS;
};

let _cachedSettings = getStoredLocalSettings();
let _loadPromise = null;

export const loadSettings = async () => {
  if (_loadPromise) return _loadPromise;

  _loadPromise = getGeneralSettings()
    .then(data => {
      if (data && typeof data === 'object') {
        _cachedSettings = { ...DEFAULT_SETTINGS, ..._cachedSettings, ...data };
        try {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(_cachedSettings));
        } catch (e) {}
        window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: _cachedSettings }));
      }
      _loadPromise = null;
      return _cachedSettings;
    })
    .catch(() => {
      _loadPromise = null;
      return _cachedSettings;
    });

  return _loadPromise;
};

export const getCachedSettings = () => {
  if (!_cachedSettings) {
    _cachedSettings = getStoredLocalSettings();
  }
  return _cachedSettings;
};

export const updateCachedSettings = (newSettings) => {
  _cachedSettings = { ..._cachedSettings, ...newSettings };
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(_cachedSettings));
  } catch (e) {}
  window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: _cachedSettings }));
  return _cachedSettings;
};

export const refreshSettingsCache = async () => {
  _loadPromise = null;
  return loadSettings();
};

/**
 * Custom React Hook to subscribe to real-time currency, timezone & localization changes app-wide
 */
export const useSettings = () => {
  const [settings, setSettings] = useState(getCachedSettings);

  useEffect(() => {
    const handler = (e) => {
      setSettings(e.detail || getCachedSettings());
    };
    window.addEventListener(SETTINGS_EVENT, handler);
    return () => window.removeEventListener(SETTINGS_EVENT, handler);
  }, []);

  return {
    settings,
    currency: settings.currency || 'USD',
    timezone: settings.timezone || 'America/Chicago',
    dateFormat: settings.dateFormat || 'MM/DD/YYYY',
    timeFormat: settings.timeFormat || '12H'
  };
};
