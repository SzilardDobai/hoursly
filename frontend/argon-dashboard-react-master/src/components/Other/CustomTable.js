import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import cellEditFactory from 'react-bootstrap-table2-editor';

import {
    Button,
    Spinner
} from "reactstrap";

const { SearchBar, ClearSearchButton } = Search;

const CustomTable = ({ data, columns, addButton, deleteButton, exportCSV, searchBox, handleDelete, handleModalOpen, lockedFirstRow, selectable, editable }) => {
    let selection

    const selectRowProps = {
        mode: 'checkbox',
        clickToSelect: true,
        bgColor: '#64fccc',
        headerColumnStyle: { backgroundColor: 'white' },
        nonSelectable: lockedFirstRow ? [1] : []
    }

    const rowEvents = {
        onDoubleClick: (e, row, rowIndex) => {
            if ((rowIndex !== 0 || !lockedFirstRow) && handleModalOpen)
                onModalOpen(row)
        }
    }

    const cellEditProps = {
        mode: 'dbclick',
        blurToSave: true,
        beforeSaveCell: (oldValue, newValue, row, column, done) => {
            setTimeout(() => {
                if (window.confirm('Click \'OK\' to confirm the change.')) {
                    done(); // contine to save the changes
                } else {
                    done(false); // reject the changes
                }
            }, 0);
            return { async: true };
        },
        afterSaveCell: (oldValue, newValue, row, column) => {editable(row.record_id, newValue)}
    }

    const NoDataIndication = () => (
        <div align={'center'}>
            <Spinner animation="border" role="status">
                {'Loading...'}
            </Spinner>
        </div>
    );

    const onDeleteClick = (ids) => {
        handleDelete(ids)
    };

    const onModalOpen = (data) => {
        handleModalOpen(data)
    };

    return (
        <>
            <div>
                <ToolkitProvider
                    keyField={columns[0].dataField}
                    data={data}
                    columns={columns}
                    exportCSV={{ fileName: `${exportCSV}.csv` }}

                    search
                >
                    {
                        props => (
                            <div>
                                <div style={{ textAlign: 'left' }}>
                                    {addButton && <Button color="success" size="sm" type="button" onClick={() => onModalOpen(null)}>{addButton}</Button>}
                                    {deleteButton && <Button color="danger" size="sm" type="button" onClick={() => onDeleteClick(selection.selectionContext.selected)}>{deleteButton}</Button>}
                                    {exportCSV && <Button color="primary" size="sm" type="button" onClick={() => props.csvProps.onExport()}>Export as CSV</Button>}
                                    {searchBox && <div style={{ float: 'right' }}>
                                        <SearchBar {...props.searchProps} style={{ maxHeight: 30, maxWidth: 250 }} /> {'\t'}
                                        <ClearSearchButton {...props.searchProps} className={'btn btn-sm'} />
                                    </div>}
                                </div>
                                <BootstrapTable
                                    rowStyle={{ backgroundColor: 'white' }}
                                    hover
                                    ref={n => selection = n}
                                    pagination={paginationFactory()}
                                    rowEvents={rowEvents}
                                    noDataIndication={() => <NoDataIndication />}
                                    selectRow={selectable && selectRowProps}
                                    cellEdit={editable && cellEditFactory(cellEditProps)}
                                    {...props.baseProps}
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>
            </div>
        </>
    )
}

export default CustomTable;
