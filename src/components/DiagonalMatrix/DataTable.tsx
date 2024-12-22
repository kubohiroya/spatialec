import React, {
  forwardRef,
  ReactNode,
  RefObject,
  useImperativeHandle,
} from 'react';
import styled from '@emotion/styled';
import { isInfinity, round } from '/app/utils/mathUtil';
import { Box, CircularProgress } from '@mui/material';

type DataTableProps = {
  tableRef: RefObject<HTMLTableElement>;
  id: string;
  columnHeaders: string[];
  rowHeaders: string[];
  data: number[][] | null;
  columnStart: number;
  columnEnd: number;
  rowStart: number;
  rowEnd: number;

  rgb: {
    r: number;
    g: number;
    b: number;
  };

  affectRow: (
    matrixId: string,
    rowIndex: number,
    className: 'focus' | 'select',
    action: 'add' | 'remove'
  ) => void;
  affectColumn: (
    matrixId: string,
    columnIndex: number,
    className: 'focus' | 'select',
    action: 'add' | 'remove'
  ) => void;
  affectCell: (
    matrixId: string,
    rowIndex: number,
    columnIndex: number,
    className: 'focus' | 'select',
    action: 'add' | 'remove'
  ) => void;
};

function getCell(
  rgb: {
    r: number;
    g: number;
    b: number;
  },
  cellValue: number,
  maxValue: number
): {
  backgroundColor: string;
  valueString: string;
} {
  return {
    valueString: isInfinity(cellValue) ? '♾️️' : round(cellValue, 0.01),
    backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${cellValue / maxValue})`,
  };
}

const __DataTable = forwardRef((props: DataTableProps, ref) => {
  const { columnHeaders, rowHeaders, data } = props;

  const modifyClass = (
    action: 'add' | 'remove',
    className: string,
    element: Element
  ) => {
    element.classList[action](className);
  };

  const affectRow = (
    rowIndex: number,
    className: 'focus' | 'select',
    action: 'add' | 'remove'
  ) => {
    const rows = props.tableRef.current?.rows;
    if (rows) {
      for (
        let columnIndex = 0;
        columnIndex < rows[rowIndex + 1].cells.length;
        columnIndex++
      ) {
        modifyClass(action, className, rows[rowIndex + 1].cells[columnIndex]);
      }
      props.affectRow(props.id, rowIndex, className, action);
    }
  };

  const affectColumn = (
    columnIndex: number,
    className: 'focus' | 'select',
    action: 'add' | 'remove'
  ) => {
    const rows = props.tableRef.current?.rows;
    if (rows) {
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        modifyClass(action, className, rows[rowIndex].cells[columnIndex + 1]);
      }
    }
  };

  const affectCell = (
    rowIndex: number,
    columnIndex: number,
    className: 'focus' | 'select',
    action: 'add' | 'remove'
  ) => {
    const rows = props.tableRef.current?.rows;
    if (rows) {
      modifyClass(action, className, rows[rowIndex + 1].cells[columnIndex + 1]);
      props.affectCell(props.id, rowIndex, columnIndex, className, action);
    }
  };

  const clearClasses = (className: string) => {
    if (props.tableRef.current) {
      props.tableRef.current
        .querySelectorAll(`td.${className}, th.${className}`)
        .forEach((cell) => {
          cell.classList.remove(className);
        });
    }
  };

  useImperativeHandle(ref, () => ({
    focusRow: (rowIndex: number) => {
      affectRow(rowIndex, 'focus', 'add');
    },
    focusColumn: (colIndex: number) => affectColumn(colIndex, 'focus', 'add'),
    focusCell: (rowIndex: number, colIndex: number) =>
      affectCell(rowIndex, colIndex, 'focus', 'add'),
    unfocusRow: (rowIndex: number) => affectRow(rowIndex, 'focus', 'remove'),
    unfocusColumn: (colIndex: number) =>
      affectColumn(colIndex, 'focus', 'remove'),
    unfocusCell: (rowIndex: number, colIndex: number) =>
      affectCell(rowIndex, colIndex, 'focus', 'remove'),
    selectRow: (rowIndex: number) => {
      affectRow(rowIndex, 'select', 'add');
    },
    selectColumn: (colIndex: number) => affectColumn(colIndex, 'select', 'add'),
    selectCell: (rowIndex: number, colIndex: number) =>
      affectCell(rowIndex, colIndex, 'select', 'add'),
    unselectRow: (rowIndex: number) => affectRow(rowIndex, 'select', 'remove'),
    unselectColumn: (colIndex: number) =>
      affectColumn(colIndex, 'select', 'remove'),
    unselectCell: (rowIndex: number, colIndex: number) =>
      affectCell(rowIndex, colIndex, 'select', 'remove'),
    clearClasses: (className: string) => clearClasses(className),
  }));

  const maxValue: number =
    (props.data &&
      props.data.reduce(
        (prev, curr) =>
          Math.max(prev, ...curr.filter((value) => !isInfinity(value))),
        0
      )) ||
    0;

  const handleMouseEvent = (
    rowIndex: number,
    columnIndex: number,
    className: 'focus' | 'select',
    action: 'add' | 'remove',
    propagation: boolean
  ) => {
    if (props.tableRef.current) {
      // 全てのセルから対象クラスを一旦削除
      if (rowIndex === -1 && columnIndex === -1) {
        props.tableRef.current.querySelectorAll('td, th').forEach((cell) => {
          cell.classList.remove(className);
        });
        propagation && props.affectCell(props.id, -1, -1, className, 'remove');
      }

      // テーブル全体にクラスを適用
      if (className === 'focus') {
        if (action === 'add') {
          props.tableRef.current.classList.add('focus');
        } else {
          props.tableRef.current.classList.remove('focus');
        }
      }

      // 指定された行と列に対象クラスを追加
      if (rowIndex === -1) {
        // 列ヘッダが触れられた場合、その列全体が対象
        const rows = props.tableRef.current.rows;
        if (action === 'add') {
          for (let j = 1; j < rows.length; j++) {
            rows[j].cells[columnIndex + 1].classList.add(className);
          }
          propagation &&
            props.affectColumn(props.id, rowIndex, className, 'add');
        } else if (action === 'remove') {
          for (let j = 1; j < rows.length; j++) {
            rows[j].cells[columnIndex + 1].classList.remove(className);
          }
          propagation &&
            props.affectColumn(props.id, rowIndex, className, 'remove');
        }
      } else if (columnIndex === -1) {
        // 行ヘッダが触れられた場合、その行全体が対象
        const rows = props.tableRef.current.rows;
        if (action === 'add') {
          for (let i = 0; i < rows[rowIndex + 1].cells.length; i++) {
            rows[rowIndex + 1].cells[i].classList.add(className);
          }
          propagation &&
            props.affectColumn(props.id, rowIndex, className, 'add');
        } else if (action === 'remove') {
          for (let i = 0; i < rows[rowIndex + 1].cells.length; i++) {
            rows[rowIndex + 1].cells[i].classList.remove(className);
          }
          propagation &&
            props.affectColumn(props.id, rowIndex, className, 'remove');
        }
      } else {
        // 特定のセルが触れられた場合、その行と列が対象
        const rows = props.tableRef.current.rows;
        if (action === 'add') {
          for (let i = 0; i < rows[rowIndex + 1].cells.length; i++) {
            rows[rowIndex + 1].cells[i].classList.add(className);
          }
          for (let j = 1; j < rows.length; j++) {
            rows[j].cells[columnIndex + 1].classList.add(className);
          }
          propagation &&
            props.affectCell(props.id, rowIndex, columnIndex, className, 'add');
        } else {
          for (let i = 0; i < rows[rowIndex + 1].cells.length; i++) {
            rows[rowIndex + 1].cells[i].classList.remove(className);
          }
          for (let j = 1; j < rows.length; j++) {
            rows[j].cells[columnIndex + 1].classList.remove(className);
          }
          propagation &&
            props.affectCell(
              props.id,
              rowIndex,
              columnIndex,
              className,
              'remove'
            );
        }
      }
    }
  };

  if (!data) {
    return (
      <StyledBox>
        <CircularProgress />
      </StyledBox>
    );
  }

  return (
    <table id={props.id} ref={props.tableRef}>
      <thead>
        <tr>
          <th></th>
          {columnHeaders
            .filter(
              (_, columnIndex) =>
                props.columnStart <= columnIndex &&
                columnIndex <= props.columnEnd
            )
            .map((header, columnIndex) => (
              <th
                key={columnIndex + props.columnStart}
                onMouseEnter={() =>
                  handleMouseEvent(-1, columnIndex, 'focus', 'add', true)
                }
                onMouseLeave={() =>
                  handleMouseEvent(-1, columnIndex, 'focus', 'remove', true)
                }
              >
                {header}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {data
          .filter(
            (_, rowIndex) =>
              props.rowStart <= rowIndex && rowIndex <= props.rowEnd
          )
          .map((row, rowIndex) => (
            <tr key={rowIndex + props.rowStart}>
              <th
                onMouseEnter={() =>
                  handleMouseEvent(rowIndex, -1, 'focus', 'add', true)
                }
                onMouseLeave={() =>
                  handleMouseEvent(rowIndex, -1, 'focus', 'remove', true)
                }
              >
                {rowHeaders[rowIndex + props.rowStart]}
              </th>
              {row
                .filter(
                  (_, columnIndex) =>
                    props.columnStart <= columnIndex &&
                    columnIndex <= props.columnEnd
                )
                .map((cellValue, columnIndex) => {
                  const cell = getCell(props.rgb, cellValue, maxValue);
                  return (
                    <td
                      key={columnIndex + props.columnStart}
                      style={{ backgroundColor: cell.backgroundColor }}
                      onMouseEnter={() =>
                        handleMouseEvent(
                          rowIndex,
                          columnIndex,
                          'focus',
                          'add',
                          true
                        )
                      }
                      onMouseLeave={() =>
                        handleMouseEvent(
                          rowIndex,
                          columnIndex,
                          'focus',
                          'remove',
                          true
                        )
                      }
                    >
                      {cell.valueString}
                    </td>
                  );
                })}
            </tr>
          ))}
      </tbody>
    </table>
  );
});

const StyledBox = styled(Box)`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const _DataTable = styled(__DataTable)`
  .focus {
    background-color: #dddd88; /* フォーカスされたセルを目立たせるための色 */
  }
  .selected {
    background-color: yellow; /* 選択されたセルを目立たせるための色 */
  }
`;

const HeaderWithIcon = styled.h3`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 0;
  margin-bottom: 10px;
`;

const DataTable = (
  props: DataTableProps & { icon: ReactNode; title: string }
) => {
  return (
    <>
      <HeaderWithIcon>
        {props.icon}
        {props.title}
      </HeaderWithIcon>
      <_DataTable {...props} />
    </>
  );
};

export default DataTable;
