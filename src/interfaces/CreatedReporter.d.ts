import Excel from 'exceljs';

export interface CreatedReporter { 
    worksheet : Excel.stream.xlsx.Worksheet,
    workbook : Excel.WorkbookWriter,
    filename : string
}