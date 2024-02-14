import Header from './elements/Header';
import Map from './elements/Map';
import Site from './elements/Site';
import Chart from './elements/Chart';
import Building from './elements/Building';
import Option from './elements/Option';

function App() {
    return (
        <>
            <Header />
            <main>
                <Map />
                <Site />
                <Chart />
                <Building />
                <Option />
            </main>
        </>
    );
}

export default App;
