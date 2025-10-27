'use client'

import { useState, useCallback, useEffect } from 'react';
import { UnsavedChangesState } from './types';

export function useUnsavedChanges() {
  const [state, setState] = useState<UnsavedChangesState>({
    hasUnsavedChanges: false,
    pendingAction: undefined,
    showWarningModal: false,
  });

  // Mark as having unsaved changes
  const markAsUnsaved = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasUnsavedChanges: true,
    }));
  }, []);

  // Mark as saved (clear unsaved changes)
  const markAsSaved = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasUnsavedChanges: false,
      pendingAction: undefined,
      showWarningModal: false,
    }));
  }, []);

  // Attempt to perform an action that might lose unsaved changes
  const attemptAction = useCallback((action: () => void) => {
    if (state.hasUnsavedChanges) {
      setState(prev => ({
        ...prev,
        pendingAction: action,
        showWarningModal: true,
      }));
    } else {
      action();
    }
  }, [state.hasUnsavedChanges]);

  // Confirm and discard changes
  const discardChanges = useCallback(() => {
    const { pendingAction } = state;
    setState({
      hasUnsavedChanges: false,
      pendingAction: undefined,
      showWarningModal: false,
    });

    if (pendingAction) {
      pendingAction();
    }
  }, [state]);

  // Close modal without any action
  const closeModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      pendingAction: undefined,
      showWarningModal: false,
    }));
  }, []);

  // Save changes and then execute pending action
  const saveAndContinue = useCallback((onSave: () => Promise<void> | void) => {
    const { pendingAction } = state;

    const executeSave = async () => {
      try {
        await onSave();
        setState({
          hasUnsavedChanges: false,
          pendingAction: undefined,
          showWarningModal: false,
        });

        if (pendingAction) {
          pendingAction();
        }
      } catch (error) {
        console.error('Error saving:', error);
        // Keep the modal open on error
      }
    };

    executeSave();
  }, [state]);

  // Listen for browser unload events
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.hasUnsavedChanges]);

  return {
    ...state,
    markAsUnsaved,
    markAsSaved,
    attemptAction,
    discardChanges,
    closeModal,
    saveAndContinue,
  };
}