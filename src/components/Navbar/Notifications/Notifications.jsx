import React, { useEffect } from 'react';
import { NotificationsContainer, NotificationsStyledContainer, NotificationsWrapper, NotiTopContainer } from './NotificationsStyles';
import Notification from './Notification';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toggleHiddenNotis } from '../../../redux/Notis/notisSlice';
import { HiChevronLeft } from "react-icons/hi2";

const Notifications = () => {
  const dispatch = useDispatch();
  const hiddenNotis = useSelector((state) => state.notis.hidden);

  useEffect(() => {
    if (!hiddenNotis) {
      document.body.style.overflow = 'hidden'; // Desactiva el scroll de la página
    } else {
      document.body.style.overflow = ''; // Reactiva el scroll de la página
    }

    // Cleanup on unmount or when hiddenNotis changes
    return () => {
      document.body.style.overflow = '';
    };
  }, [hiddenNotis]);

  return (
    <AnimatePresence>
      {!hiddenNotis && (
        <NotificationsStyledContainer
          initial={{ translateX: 1000 }}
          animate={{ translateX: 0 }}
          exit={{ translateX: 1000, opacity: 0 }}
          transition={{ type: "spring", damping: 27 }}
          key="menu-modal">
          <NotificationsWrapper>
            <NotiTopContainer>
              <HiChevronLeft onClick={() => dispatch(toggleHiddenNotis())} />
              <h3>Notificaciones</h3>
            </NotiTopContainer>

            <NotificationsContainer>
              <Notification />
            </NotificationsContainer>
          </NotificationsWrapper>
        </NotificationsStyledContainer>
      )}
    </AnimatePresence>
  );
};

export default Notifications;
