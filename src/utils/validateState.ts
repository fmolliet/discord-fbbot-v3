const brasilUf = ['RO','AC','AM','RR','PA','AP','TO','MA','PI','CE','RN','PB','PE','AL','SE','BA', 'MG', 'ES', 'RJ', 'SP','PR', 'SC','RS', 'MS', 'MT','GO', 'DF'];

export default function( uf : string ) : string | boolean {
    if ( !uf ){
        return false;
    }
    uf = uf.toUpperCase();
    
    return brasilUf.includes(uf) ? uf : false;
}