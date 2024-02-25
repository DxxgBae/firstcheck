import Header from './elements/Header';
import Map from './elements/Map';
import Site from './elements/Site';
import Chart from './elements/Chart';

function App() {
    return (
        <>
            <Header />
            <main>
                <Map />
                <Site />
                <Chart />
            </main>
        </>
    );
}

export default App;
