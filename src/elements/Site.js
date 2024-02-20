import { useState, useEffect } from 'react';
import { stateFeatures } from './store';
import './Site.css';

function Site() {
    const { features } = stateFeatures();
    const [totalArea, setTotalArea] = useState(0);
    const [totalJiga, setTotalJiga] = useState(0);
    const [yearJiga, setYearJiga] = useState(new Date().getFullYear());
    const [unit, setUnit] = useState(1);
    const dataLandUse = [
        { code: 'UQA111', name: '제1종전용주거지역' },
        { code: 'UQA112', name: '제2종전용주거지역' },
        { code: 'UQA121', name: '제1종일반주거지역' },
        { code: 'UQA122', name: '제2종일반주거지역' },
        { code: 'UQA123', name: '제3종일반주거지역' },
        { code: 'UQA130', name: '준주거지역' },
        { code: 'UQA210', name: '중심상업지역' },
        { code: 'UQA220', name: '일반상업지역' },
        { code: 'UQA230', name: '근린상업지역' },
        { code: 'UQA240', name: '유통상업지역' },
        { code: 'UQA310', name: '전용공업지역' },
        { code: 'UQA320', name: '일반공업지역' },
        { code: 'UQA330', name: '준공업지역' },
        { code: 'UQA410', name: '보전녹지지역' },
        { code: 'UQA420', name: '생산녹지지역' },
        { code: 'UQA430', name: '자연녹지지역' },
        { code: 'UQB100', name: '계획관리지역' },
        { code: 'UQB200', name: '생산관리지역' },
        { code: 'UQB300', name: '보전관리지역' },
        { code: 'UQC001', name: '농림지역' },
        { code: 'UQD001', name: '자연환경보전지역' },
    ]

    const getJiga = (feature, year) => {
        if (!feature.property_jiga) return;

        for (var i of feature.property_jiga)
            if (i.stdrYear === year)
                return [Number(i.pblntfPclnd), `${i.stdrYear}-${i.stdrMt}`];

        return [0,];
    };

    const getLandUse = (feature) => {
        if (!feature.property_landUse) return;

        const landUses = [];

        for (var i of feature.property_landUse)
            if (i.cnflcAt === '1')
                for (var j of dataLandUse)
                    if (j.code.toString() === i.prposAreaDstrcCode.toString())
                        if (landUses.indexOf(i.prposAreaDstrcCodeNm) < 0) landUses.push(i.prposAreaDstrcCodeNm);

        for (var ii of feature.property_landUse)
            if (ii.cnflcAt === '2')
                for (var jj of dataLandUse)
                    if (jj.code.toString() === ii.prposAreaDstrcCode.toString())
                        if (landUses.indexOf(ii.prposAreaDstrcCodeNm) < 0) landUses.push(ii.prposAreaDstrcCodeNm);

        return landUses.join(' ');
    };

    useEffect(() => {
        let area = 0;
        let jiga = 0;

        for (var i of features) {
            area += i.property_parea;
            jiga += i.property_parea * getJiga(i, yearJiga)[0];
        }

        setTotalArea(area);
        setTotalJiga(jiga);
    }, [features, yearJiga]);

    return (
        <section id='Site'>
            <div className='noise' />
            <div className='info'>
                <p>선택한 대지의</p>
                <p>
                    개수는
                    {' '}<span>{`${features.length}`}</span>
                    <b> 개</b> 이고,
                </p>
                <p>
                    면적은
                    {' '}<span>{`${totalArea === 0 ? 0 : (totalArea * unit).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</span>
                    <b> {unit === 1 ? '제곱미터' : '평'}</b> 이고,
                </p>
                <p>
                    공시가격은
                    <input type='number' dir='rtl' min={1989} max={new Date().getFullYear()} defaultValue={yearJiga} onChange={(e) => setYearJiga(e.target.value)} />
                    <b>년</b> 기준
                    {' '}<span>{`${totalJiga.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</span>
                    <b> 원</b> 입니다.
                </p>
            </div>
            <h2>LIST</h2>
            <div className='tool'>
                <div className='item' onClick={() => unit === 1 ? setUnit(.3025) : setUnit(1)}>
                    <small><b>{unit === 1 ? '제곱미터' : '평'}</b></small>
                    <i className='fa-solid fa-arrow-right-arrow-left' />
                    <small><b>{unit !== 1 ? '제곱미터' : '평'}</b></small>
                </div>
                <div className='item'
                    onClick={() => {
                        if (features.length === 0) return;
                        let csv = '번호,주소,지목,용도,면적(m²),공시가격,공시일,소유자,소유자수\n';
                        for (var i in features) csv += `${Number(i) + 1},${features[i].property_addr},${features[i].property_jimok},${getLandUse(features[i])},${features[i].property_parea},${getJiga(features[i], yearJiga)[0]},${getJiga(features[i], yearJiga)[1]},${features[i].property_owner_nm},${features[i].property_owner_count}\n`;
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
                        <td style={{ width: '6rem' }}>
                            <b>소유자수</b>
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
                                {getJiga(item, yearJiga)[0] === 0 ? undefined : (getJiga(item, yearJiga)[0] * unit).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </td>
                            <td>
                                {getJiga(item, yearJiga)[1]}
                            </td>
                            <td>
                                {item.property_owner_nm}
                            </td>
                            <td>
                                {item.property_owner_count}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>

    );
}

export default Site;