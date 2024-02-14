import './Header.css';

function Header() {
    return (
        <header id='Header'>
            <div className='noise' />
            <nav>
                <ul>
                    <li className='item'>
                        <a href='#Map'>
                            <i className='fa-solid fa-map fa-xl' />
                        </a>
                        <h6 className='title'>MAP</h6>
                    </li>
                    <div className='hline' />
                    <li className='item'>
                        <a href='#Site'>
                            <i className='fa-solid fa-location-dot fa-xl' />
                        </a>
                        <h6 className='title'>SITE</h6>
                    </li>
                    <li className='item'>
                        <a href='#Chart'>
                            <i className='fa-solid fa-chart-simple fa-xl' />
                        </a>
                        <h6 className='title'>CHART</h6>
                    </li>
                    <div className='hline' />
                    <li className='item'>
                        <a href='#Building'>
                            <i className='fa-solid fa-building fa-xl' />
                        </a>
                        <h6 className='title'>BUILDING</h6>
                    </li>
                    <li className='item'>
                        <a href='#Option'>
                            <i className='fa-solid fa-sliders fa-xl' />
                        </a>
                        <h6 className='title'>OPTION</h6>
                    </li>
                </ul>
                <ul>
                    <li className='item'>
                        <i className='fa-solid fa-circle-user fa-xl' />
                        <h6 className='title'>USER</h6>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;