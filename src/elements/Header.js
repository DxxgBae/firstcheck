import './Header.css';

function Header() {
    return (
        <header id='Header'>
            <div className='noise' />
            <nav>
                <ul>
                    <li className='item' onClick={() => document.getElementById('Map').scrollIntoView()}>
                        <i className='fa-solid fa-map fa-xl' />
                        <h6 className='title'>
                            <i className='fa-solid fa-play' />
                            MAP
                        </h6>
                    </li>
                    <div className='hline' />
                    <li className='item' onClick={() => document.getElementById('Site').scrollIntoView()}>
                        <i className='fa-solid fa-location-dot fa-xl' />
                        <h6 className='title'>
                            <i className='fa-solid fa-play' />
                            SITE
                        </h6>
                    </li>
                    <li className='item' onClick={() => document.getElementById('Chart').scrollIntoView()}>
                        <i className='fa-solid fa-chart-simple fa-xl' />
                        <h6 className='title'>
                            <i className='fa-solid fa-play' />
                            CHART
                        </h6>
                    </li>
                    <div className='hline' />
                    <li className='item' onClick={() => document.getElementById('Building').scrollIntoView()}>
                        <i className='fa-solid fa-building fa-xl' />
                        <h6 className='title'>
                            <i className='fa-solid fa-play' />
                            BUILDING
                        </h6>
                    </li>
                    <li className='item' onClick={() => document.getElementById('Option').scrollIntoView()}>
                        <i className='fa-solid fa-sliders fa-xl' />
                        <h6 className='title'>
                            <i className='fa-solid fa-play' />
                            OPTION
                        </h6>
                    </li>
                </ul>
                <ul>
                    <li className='item'>
                        <i className='fa-solid fa-bookmark fa-xl' />
                        <h6 className='title'>
                            <i className='fa-solid fa-play' />
                            BOOKMARK
                        </h6>
                    </li>
                    <li className='item'>
                        <i className='fa-solid fa-circle-user fa-xl' />
                        <h6 className='title'>
                            <i className='fa-solid fa-play' />
                            USER
                        </h6>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;