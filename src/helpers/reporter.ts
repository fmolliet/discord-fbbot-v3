import fs      from 'fs';
import Excel from 'exceljs';
import { CreatedReporter } from '../interfaces';

export async function createMeetReport( ) : Promise<CreatedReporter> {
    
    const options = {
        filename: './temp/members.xlsx',
        useStyles: true,
        useSharedStrings: true
    };
    
    const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
    const worksheet = workbook.addWorksheet('membros');
    
    worksheet.columns = [
        { header: 'ID',  key: 'userId' },
        { header: 'ESTADO',   key: 'state'  },
        { header: 'NOME', key: 'name'  }
    ];
    
    return {
        worksheet,
        workbook,
        filename: options.filename
    };
}

export async function createBirthDayReport( ) : Promise<CreatedReporter> {
    
    const options = {
        filename: './temp/members.xlsx',
        useStyles: true,
        useSharedStrings: true
    };
    
    const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
    const worksheet = workbook.addWorksheet('membros');
    
    worksheet.columns = [
        { header: 'ID',  key: 'userId' },
        { header: 'NOME', key: 'name'  },
        { header: 'DIA', key: 'day'  },
        { header: 'MÊS', key: 'month'  }
    ];
    
    return {
        worksheet,
        workbook,
        filename: options.filename
    };
}