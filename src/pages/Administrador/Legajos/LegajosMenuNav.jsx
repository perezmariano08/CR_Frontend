import React from 'react';
import { ContentNavWrapper } from '../../../components/Content/ContentStyles';
import { NavLink } from 'react-router-dom';

const LegajosMenuNav = ({ children }) => {

    return (
        <ContentNavWrapper>
            <li><NavLink to={`/admin/legajos/jugadores`}>Legajos de jugadores</NavLink></li>
            <li><NavLink to={`/admin/legajos/equipos`}>Legajos de equipos</NavLink></li>
            {children}
        </ContentNavWrapper>
    );
};

export default LegajosMenuNav;
