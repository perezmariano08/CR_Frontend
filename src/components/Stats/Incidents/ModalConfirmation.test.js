import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import ModalConfirmation from './ModalConfirmation';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

test('debería confirmar la acción y llamar a las funciones correspondientes', async () => {
  const store = mockStore({
    planillero: { 
      modal: { hidden: false, modalState: 'matchPush' },
      timeMatch: { idMatch: 1, mvp: true },
    },
    matches: {},
  });
  
  render(
    <Provider store={store}>
      <ModalConfirmation />
    </Provider>
  );
  
  fireEvent.click(screen.getByText('Confirmar'));
  
  expect(store.getActions()).toEqual([
    { type: 'planillero/deleteActionToPlayer', payload: expect.any(Object) },
    { type: 'planillero/toggleHiddenModal' },
  ]);
});
