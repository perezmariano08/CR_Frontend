import React from 'react'
import { TablePosicionesSkeletonWrapper } from './TablePosicionesStyles'
import { Skeleton } from 'primereact/skeleton';

const TablePosicionesLoader = () => {
    return (
        <TablePosicionesSkeletonWrapper>
            <div style={{ display: 'flex', gap: '10px' }}>
                <Skeleton height='16px' width='16px' />
                <Skeleton size='16px' shape='circle' />
                <Skeleton height='16px' width='150px' />
                <Skeleton height='16px' width='16px' />
                <Skeleton height='16px' width='16px' />
                <Skeleton height='16px' width='16px' />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <Skeleton height='16px' width='16px' />
                <Skeleton size='16px' shape='circle' />
                <Skeleton height='16px' width='150px' />
                <Skeleton height='16px' width='16px' />
                <Skeleton height='16px' width='16px' />
                <Skeleton height='16px' width='16px' />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <Skeleton height='16px' width='16px' />
                <Skeleton size='16px' shape='circle' />
                <Skeleton height='16px' width='150px' />
                <Skeleton height='16px' width='16px' />
                <Skeleton height='16px' width='16px' />
                <Skeleton height='16px' width='16px' />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <Skeleton height='16px' width='16px' />
                <Skeleton size='16px' shape='circle' />
                <Skeleton height='16px' width='150px' />
                <Skeleton height='16px' width='16px' />
                <Skeleton height='16px' width='16px' />
                <Skeleton height='16px' width='16px' />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <Skeleton height='16px' width='16px' />
                <Skeleton size='16px' shape='circle' />
                <Skeleton height='16px' width='150px' />
                <Skeleton height='16px' width='16px' />
                <Skeleton height='16px' width='16px' />
                <Skeleton height='16px' width='16px' />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <Skeleton height='16px' width='16px' />
                <Skeleton size='16px' shape='circle' />
                <Skeleton height='16px' width='150px' />
                <Skeleton height='16px' width='16px' />
                <Skeleton height='16px' width='16px' />
                <Skeleton height='16px' width='16px' />
            </div>
        </TablePosicionesSkeletonWrapper>
    )
}

export default TablePosicionesLoader