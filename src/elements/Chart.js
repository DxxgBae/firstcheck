import { useEffect, useState } from 'react';
import { stateFeatures } from './storeMap';
//import fetchJsonp from 'fetch-jsonp';
import './Chart.css';

function Chart() {
    const { features } = stateFeatures();
    const [sidoCode, setSidoCode] = useState();
    const [siggCode, setSiggCode] = useState();

    useEffect(() => {
        //const keyKosis = 'NjQ0MmY4MDk5YTQwMzdjMGYyMTYxYmU1ZDY4OTNiMjI=';
        if (features.length > 0) {
            if (sidoCode !== features[0].property_sido_cd) {
                const sidoCode = features[0].property_sido_cd;
                setSidoCode(sidoCode);
            }
            if (siggCode !== features[0].property_sgg_cd) {
                const siggCode = features[0].property_sgg_cd;
                setSiggCode(siggCode);
            }
        }
    }, [features, sidoCode, siggCode]);

    return (
        <section id='Chart'>
            <div className='noise' />
            <h2>CHART</h2>
            <div>
                {sidoCode}
            </div>
            <div>
                {siggCode}
            </div>
        </section>
    );
}

export default Chart;