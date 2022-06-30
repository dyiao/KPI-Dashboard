import React from 'react'
import { RiArrowUpSFill, RiArrowDownSFill } from 'react-icons/ri';
import "./upsetTableStyle.css"
const UpsetTableLayout = ({
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    nextPage,
    previousPage,
    gotoPage,
    state: { pageIndex, pageSize },
    totalUpset
}) => {
    const firstPageRows = rows.slice(0, 20)
    return (

        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th className="tableHeader bg-gray-100"{...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? <div className="w-full flex justify-center text-xl"><RiArrowDownSFill /></div>
                                                : <div className="w-full flex justify-center text-xl"><RiArrowUpSFill /></div>
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody className="bg-white block" {...getTableBodyProps()}>
                    {page.map(
                        (row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td className="tableData" {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                </tbody>
            </table>

            <div className="pagination mt-3">
                <button className={!canPreviousPage ? "inactivePageButton" : "activePageButton"} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </button>{' '}

                <button className={!canPreviousPage ? "inactivePageButton" : "activePageButton"} onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {"<"}
                </button>{' '}

                <button className={!canNextPage ? "inactivePageButton" : "activePageButton"} onClick={() => nextPage()} disabled={!canNextPage}>
                    {">"}
                </button>{' '}
                <button className={!canNextPage ? "inactivePageButton" : "activePageButton"} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {">>"}
                </button>{' '}
                <br></br>

                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <div className="font-bold">
                    {totalUpset} total upsets
                </div>
                <span></span>


            </div>
            <br />
        </>
    );
}

export default UpsetTableLayout