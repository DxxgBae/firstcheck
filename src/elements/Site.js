import { useState } from 'react';
import { useStore } from './Store';
import './Site.css';

function Site() {
    const { features, clearFeatures } = useStore();
    const [yearJiga, setYearJiga] = useState(new Date().getFullYear());
    const [unit, setUnit] = useState(1);

    const getTotalArea = (features) => {
        let area = 0;
        for (var i of features) area += i.property_parea;
        return area;
    };

    const getTotalJiga = (features) => {
        let price = 0;
        for (var i of features)
            if (i.property_jiga)
                for (var j of i.property_jiga)
                    if (j.stdrYear === yearJiga) {
                        price += i.property_parea * j.pblntfPclnd;
                        continue;
                    }
        return price;
    };

    const getJiga = (feature) => {
        let price = 0;
        let year = yearJiga;
        let month = '01';
        if (feature.property_jiga)
            for (var i of feature.property_jiga)
                if (i.stdrYear === yearJiga) {
                    price = i.pblntfPclnd;
                    year = i.stdrYear;
                    month = i.stdrMt;
                    break;
                }
        return {
            price: price,
            year: year,
            month: month,
        };
    };

    const getLandUse = (feature) => {
        const dataLandUse = [
            '제1종전용주거지역',
            '제2종전용주거지역',
            '제1종일반주거지역',
            '제2종일반주거지역',
            '제3종일반주거지역',
            '준주거지역',
            '중심상업지역',
            '일반상업지역',
            '근린상업지역',
            '유통상업지역',
            '전용공업지역',
            '일반공업지역',
            '준공업지역',
            '보전녹지지역',
            '생산녹지지역',
            '자연녹지지역',
            '계획관리지역',
            '생산관리지역',
            '보전관리지역',
            '농림지역',
            '자연환경보전지역',
        ]
        const use = [];
        if (feature.property_landUse)
            for (var i of feature.property_landUse)
                if (i.cnflcAt !== '3')
                    for (var j of dataLandUse)
                        if (j === i.prposAreaDstrcCodeNm)
                            use.push(j);
        return use.join(' ');
    };

    return (
        <section id='Site'>
            <div className='noise' />
            <div className='info'>
                <p>선택한 대지의</p>
                <p>
                    개수는
                    {' '}<span>{features.length}</span>
                    <b> 개</b> 이고,
                </p>
                <p>
                    면적은
                    {' '}<span>{getTotalArea(features) === 0 ? 0 : (getTotalArea(features) * unit).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                    <b> {unit === 1 ? '제곱미터' : '평'}</b> 이고,
                </p>
                <p>
                    공시가격은
                    <input type='number' dir='rtl' min={1989} max={new Date().getFullYear()} defaultValue={yearJiga} onChange={(e) => setYearJiga(e.target.value)} />
                    <b>년</b> 기준
                    {' '}<span>{getTotalJiga(features).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                    <b> 원</b> 입니다.
                </p>
            </div>
            <h2>LIST</h2>
            <div className='tool'>
                <div className='item' onClick={() => clearFeatures()}>
                    <i className='fa-solid fa-trash-can' />
                    <small><b>DELETE ALL</b></small>
                </div>
                <div className='item'
                    onClick={() => {
                        if (features.length === 0) return;
                        let csv = '번호,주소,지목,용도,면적(m²),공시가격,공시일,소유자\n';
                        for (var i in features) {
                            const num = Number(i) + 1;
                            const addr = features[i].property_addr;
                            const jimok = features[i].property_jimok;
                            const use = getLandUse(i);
                            const area = features[i].property_parea;
                            const jiga = getJiga(i);
                            const price = jiga.price;
                            const gosi = jiga.year + '-' + jiga.month;
                            const owner = features[i].property_owner_nm;
                            const ownerCount = features[i].property_owner_count > 1 ? features[i].property_owner_count : '';
                            csv += `${num},${addr},${jimok},${use},${area},${price},${gosi},${owner + ownerCount}\n`;
                        }
                        const csvFile = new Blob(['\ufeff' + csv], { type: 'text/csv' });
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(csvFile);
                        const date = new Date();
                        link.download = `FirstCheck SiteList ${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}.csv`;
                        link.click();
                    }}>
                    <i className='fa-solid fa-download' />
                    <small><b>DOWNLOAD</b></small>
                </div>
                <div className='item' onClick={() => unit === 1 ? setUnit(.3025) : setUnit(1)}>
                    <small><b>{unit === 1 ? '제곱미터' : '평'}</b></small>
                    <i className='fa-solid fa-arrow-right-arrow-left' />
                    <small><b>{unit !== 1 ? '제곱미터' : '평'}</b></small>
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
                        <td style={{ width: '9rem' }}>
                            <b>용도</b>
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
                        <td style={{ width: '6rem' }}>
                            <b>소유자</b>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {features.map((item, index) => (
                        <tr key={index} onClick={() => window.open(`https://www.eum.go.kr/web/ar/lu/luLandDet.jsp?isNoScr=script&mode=search&pnu=${item.property_pnu}`)}>
                            <td>
                                {index + 1}
                            </td>
                            <td style={{ textAlign: 'left' }}>
                                {item.property_addr}
                            </td>
                            <td>
                                {item.property_jimok}
                            </td>
                            <td>
                                {getLandUse(item)}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                {(item.property_parea * unit).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                {(getJiga(item).price * unit).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </td>
                            <td>
                                {getJiga(item).year}-{getJiga(item).month}
                            </td>
                            <td>
                                {item.property_owner_nm}{item.property_owner_count > 1 ? item.property_owner_count : undefined}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default Site;