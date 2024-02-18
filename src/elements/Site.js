import { useState, useEffect } from 'react';
import { stateFeatures } from './store';
import './Site.css';

function Site() {
    const { features } = stateFeatures();
    const [totalArea, setTotalArea] = useState(0);
    const [totalJiga, setTotalJiga] = useState(0);
    const [unit, setUnit] = useState(1);

    useEffect(() => {
        let area = 0;
        let jiga = 0;

        features.forEach((e) => {
            area += e.property_area;
            jiga += e.property_area * e.property_jiga;
        });

        setTotalArea(area);
        setTotalJiga(jiga);
    }, [features]);

    return (
        <section id='Site'>
            <div className='noise' />
            <div className='info'>
                <p>선택한 대지의</p>
                <p>
                    개수는
                    {' '}<span>{`${features.length}`}</span>{' '}
                    <b>개</b> 이고,
                </p>
                <p>
                    면적은
                    {' '}<span>{`${totalArea === 0 ? 0 : (totalArea * unit).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</span>{' '}
                    <b>{unit === 1 ? '제곱미터' : '평'}</b> 이고,
                </p>
                <p>
                    공시가격은
                    {' '}<span>{`${totalJiga.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</span>{' '}
                    <b>원</b> 입니다.
                </p>
            </div>
            <h2>LIST</h2>
            <div className='tfoot'>
                <div className='item' onClick={() => unit === 1 ? setUnit(.3025) : setUnit(1)}>
                    <small><b>{unit === 1 ? '제곱미터' : '평'}</b></small>
                    <i className='fa-solid fa-arrow-right-arrow-left' />
                    <small><b>{unit === 1 ? '평' : '제곱미터'}</b></small>
                </div>
                <div className='item'
                    onClick={() => {
                        if (features.length === 0) return;
                        let csv = '번호,주소,지목,면적(m²),공시가격,공시일,소유자,소유자수\n';
                        for (var i in features) csv += `${Number(i) + 1},${features[i].property_addr},${features[i].property_jimok},${features[i].property_area},${features[i].property_jiga},${features[i].property_gosi_year && `${features[i].property_gosi_year}-${features[i].property_gosi_month}`},${features[i].property_owner},${features[i].property_ownerCount}\n`;
                        const csvFile = new Blob(['\ufeff' + csv], { type: 'text/csv' });
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(csvFile);
                        const date = new Date();
                        link.download = `Download ${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}.csv`;
                        link.click();
                    }}>
                    <i className='fa-solid fa-download' />
                    <small><b>DOWNLOAD</b></small>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <td style={{ width: '3rem' }}>
                            <b>번호</b>
                        </td>
                        <td>
                            <b>주소</b>
                        </td>
                        <td style={{ width: '6rem' }}>
                            <b>지목</b>
                        </td>
                        <td style={{ width: '6rem' }}>
                            <b>면적<br /><small>({unit === 1 ? '제곱미터' : '평'})</small></b>
                        </td>
                        <td style={{ width: '6rem' }}>
                            <b>공시가격<br /><small>({unit === 1 ? '제곱미터' : '평'}/원)</small></b>
                        </td>
                        <td style={{ width: '6rem' }}>
                            <b>공시일<br /><small>(YYYY-MM)</small></b>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {features.map((item, index) => (
                        <tr key={index}>
                            <td>
                                {index + 1}
                            </td>
                            <td style={{ textAlign: 'left' }}>
                                {item.property_addr}
                            </td>
                            <td>
                                {item.property_jimok}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                {(item.property_area * unit).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                {(item.property_jiga * unit).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </td>
                            <td>
                                {item.property_gosi_year && `${item.property_gosi_year}-${item.property_gosi_month}`}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default Site;