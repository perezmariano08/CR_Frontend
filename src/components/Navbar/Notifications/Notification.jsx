import React from 'react'
import { NotificationContainer, NotificationLeft, NotificationRight, NotificationText, NotificationTitle } from './NotificationsStyles'
import { HiMiniExclamationTriangle } from "react-icons/hi2";


const Notification = () => {
  return (
    <NotificationContainer>
        <NotificationLeft>
            <HiMiniExclamationTriangle />
        </NotificationLeft>
        <NotificationRight>
            <NotificationTitle>
                <h4>¡Atencion, nuevos equipos!</h4>
            </NotificationTitle>
            <NotificationText>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat odit amet praesentium facilis assumenda, voluptate alias fugit molestias. Porro deleniti libero hic? Maiores quis molestiae reiciendis repudiandae placeat nulla neque.</p>
            </NotificationText>
        </NotificationRight>
    </NotificationContainer>
  )
}

export default Notification