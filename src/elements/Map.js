import { useEffect, useRef } from 'react';
import { useStore } from './Store';
import './Map.css';

function Map() {
    const mapRef = useRef();
    const { setMap, setMapType, getScreenShot } = useStore();

    useEffect(() => setMap(mapRef.current), [setMap]);

    return (
        <section ref={mapRef} id='Map'>
            <div className='noise' />
            <div className='tool'>
                <label className='item'>
                    <input type='text' id='search' placeholder='SEARCH' />
                    <i className='fa-solid fa-search' />
                </label>
                <div className='item'>
                    <i className='fa-solid fa-ruler' />
                </div>
                <div className='item' onClick={(e) => getScreenShot(e.target)}>
                    <i className='fa-solid fa-camera' />
                </div>
                <label className='item' onChange={() => setMapType('normal')}>
                    <i className='fa-solid fa-globe' />
                    <input type='radio' name='tool' defaultChecked={true} />
                </label>
                <label className='item' onChange={() => setMapType('hybrid')}>
                    <i className='fa-solid fa-earth-asia' />
                    <input type='radio' name='tool' />
                </label>
                <label className='item' onChange={() => setMapType('cadastral')}>
                    <i className='fa-solid fa-table-cells' />
                    <input type='radio' name='tool' />
                </label>
            </div>
        </section>
    );
}

export default Map;