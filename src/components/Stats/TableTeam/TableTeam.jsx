import React from 'react'
import { TableContainerStyled, TableWrapper, TableTitle, TableTitleDivider } from '../Table/TableStyles'
import UserDefault from '/user-default.png'
import { TbRectangleVerticalFilled } from "react-icons/tb";

const TableTeam = ({jugadores, equipo}) => {

    return (
    <TableContainerStyled>
        <TableTitle>
            {/* Falta renderizado automatico del nombre del torneo */}
            <h3>Torneo Apertura 2024</h3>
            <p>{equipo.categoria} {equipo.division}</p>
        </TableTitle>
        <TableTitleDivider/>
        <TableWrapper>
            <thead>
            <tr>
                <th className='team'>Nombre</th>
                <th>PJ</th>
                <th>G</th>
                <th>A</th>
                <th className='CardYellow'> <TbRectangleVerticalFilled /> </th>
                <th className='CardRed'> <TbRectangleVerticalFilled /> </th>
            </tr>
        </thead>
        <tbody>
            {jugadores.map((jugador) => (
                <tr key={jugador.id_jugador}>
                    <td className='team'>
                        <img src={UserDefault} alt="" />
                        {jugador.nombre} {jugador.apellido}
                    </td>
                    <td>10</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
            ))}
        </tbody>
        </TableWrapper>
    </TableContainerStyled>
)
}

export default TableTeam