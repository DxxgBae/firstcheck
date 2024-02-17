import { stateFeatures } from './store';
import './Site.css';

function Site() {
    const { features } = stateFeatures();

    return (
        <section id='Site'>
            <div className='noise' />
            <div className='info'>
                <p>선택한 대지의</p>
                <p>개수는 {0} 개 이고</p>
                <p>면적은 {'0'.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} m² 이고</p>
                <p>공시가격은 {'0'.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원 입니다</p>
            </div>
            <h2>LIST</h2>
            <table>
                <thead>
                    <tr>
                        <td style={{ width: '3rem' }}>
                            번호
                        </td>
                        <td>
                            주소
                        </td>
                        <td style={{ width: '6rem' }}>
                            지목
                        </td>
                        <td style={{ width: '6rem' }}>
                            면적
                        </td>
                        <td style={{ width: '6rem' }}>
                            공시가격
                        </td>
                        <td style={{ width: '6rem' }}>
                            공시일
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
                                {Number(item.property_area).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                {item.property_jiga.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </td>
                            <td>
                                {item.property_gosi_year}-{item.property_gosi_month}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default Site;