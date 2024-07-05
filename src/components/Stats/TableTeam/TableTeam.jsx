import React from 'react'
import { TableContainerStyled, TableWrapper, TableTitle, TableTitleDivider } from '../Table/TableStyles'

import UserDefault from '/user-default.png'
import { TbRectangleVerticalFilled } from "react-icons/tb";

const TableTeam = () => {
  return (
    <TableContainerStyled>
        <TableTitle>
            <h3>Torneo Apertura 2024</h3>
            <p>Serie A</p>
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
            <tr>
                <td className='team'>
                    <img src={UserDefault} alt="" />
                    Celta de Vino
                </td>
                <td>20</td>
                <td>10</td>
                <td>+6</td>
                <td>1</td>
                <td>0</td>
            </tr>
            <tr>
                <td className='team'>
                    <img src={UserDefault} alt="" />
                    Pura Quimica
                </td>
                <td>20</td>
                <td>10</td>
                <td>+8</td>
                <td>1</td>
                <td>0</td>
            </tr>
            <tr>
                <td className='team'>
                    <img src={UserDefault} alt="" />
                    Celta de Vino
                </td>
                <td>20</td>
                <td>10</td>
                <td>+6</td>
                <td>1</td>
                <td>0</td>
            </tr>
            <tr>
                <td className='team'>
                    <img src={UserDefault} alt="" />
                    Celta de Vino
                </td>
                <td>20</td>
                <td>10</td>
                <td>+6</td>
                <td>1</td>
                <td>0</td>
            </tr>
            <tr>
                <td className='team'>
                    <img src={UserDefault} alt="" />
                    Celta de Vino
                </td>
                <td>20</td>
                <td>10</td>
                <td>+6</td>
                <td>1</td>
                <td>0</td>
            </tr>
        </tbody>
        </TableWrapper>
    </TableContainerStyled>
  )
}

export default TableTeam