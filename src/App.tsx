{/* Hooks */ }
import { useEffect, useState } from 'react';

/*import { useState } from 'react'*/
import Grid from '@mui/material/Grid2'
/*import reactLogo from './assets/react.svg'*/
/*import viteLogo from '/vite.svg'*/
import IndicatorWeather from './components/IndicatorWeather';
import './App.css'
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import Item from './interface/Item';
import NavBar from './components/NavBar'
import Time from './components/Time'

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {
  {/* Variable de estado y función de actualización */ }
  let [items, setItems] = useState<Item[]>([]);
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))

  {/* Hook: useEffect */ }
  useEffect(() => {
    let request = async () => {
      {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */ }
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");
      {/* Obtenga la estampa de tiempo actual */ }
      let nowTime = (new Date()).getTime();
      {/* Verifique si es que no existe la clave expiringTime o si la estampa de tiempo actual supera el tiempo de expiración */ }
      if (expiringTime === null || nowTime > parseInt(expiringTime)) {
        {/* Request */ }
        let API_KEY = "fd624cc67e190b02ac73ba0f05306f53"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
        let savedTextXML = await response.text();

        {/* Tiempo de expiración */ }
        let hours = 0.01
        let delay = hours * 3600000
        let expiringTime = nowTime + delay


        {/* En el LocalStorage, almacene el texto en la clave openWeatherMap, estampa actual y estampa de tiempo de expiración */ }
        localStorage.setItem("openWeatherMap", savedTextXML)
        localStorage.setItem("expiringTime", expiringTime.toString())
        localStorage.setItem("nowTime", nowTime.toString())

        {/* DateTime */ }
        localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
        localStorage.setItem("nowDateTime", new Date(nowTime).toString())

        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setOWM(savedTextXML)
      }

      {/* Valide el procesamiento con el valor de savedTextXML */ }
      if (savedTextXML) {
        {/* XML Parser: Toma texto y lo convierte a objeto*/ }
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        {/* Arreglo para agregar los resultados */ }
        let dataToIndicators: Indicator[] = new Array<Indicator>();

        {/* 
        Análisis, extracción y almacenamiento del contenido del XML 
        en el arreglo de resultados
                          */}

        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "City", "value": name })

        let location = xml.getElementsByTagName("location")[1]

        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

        let altitude = location.getAttribute("altitude") || ""
        dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })

        /*console.log(dataToIndicators)*/
        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setIndicators(dataToIndicators);

        //Crear un arreglo temporal de tipo Item
        let dataToItems: Item[] = [];

        const times = xml.getElementsByTagName("time");

        Array.from(times).forEach((timeElement) => {
          let dateStart = timeElement.getAttribute("from") || "";
          let dateEnd = timeElement.getAttribute("to") || "";

          // Extraemos los valores de las etiquetas
          let precipitation = timeElement.getElementsByTagName("precipitation")[0]?.getAttribute("probability") || "0";
          let humidity = timeElement.getElementsByTagName("humidity")[0]?.getAttribute("value") || "0";
          let clouds = timeElement.getElementsByTagName("clouds")[0]?.getAttribute("all") || "0";

          dataToItems.push({
            dateStart, dateEnd, precipitation, humidity, clouds
          });
        });

        setItems(dataToItems);

      }
    }
    request();

  }, [owm])
  /*const [count, setCount] = useState(0)*/

  return (
    <>
      <Grid container className="app-container" >
        {/* Barra de navegación ocupa 220px */}
        <Grid size={{sm:0, xs: 0, xl: 0, md:1 }} className="navbar-container">
          <NavBar />
        </Grid>

        {/* Contenido principal */}
        <Grid container spacing={2} className="main-content-container" >

          <Grid container size={{ xs: 12, xl: 12, md:12 }} id="Time" sx={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Grid size={{ xs: 12, xl: 9, md:9, sm:8, lg:9 }} sx={{ textAlign: 'left', color: 'white' }}>
              <h2 className='section-title'>Detalles de la Localización</h2>
              <p className='section-text'>
                Los indicadores de localización proporcionan información esencial sobre la ubicación específica dentro de la ciudad de Guayaquil para la que se están mostrando los datos climáticos. Estos indicadores son cruciales para ofrecer una perspectiva precisa y detallada del clima, ya que las condiciones meteorológicas pueden variar significativamente entre diferentes áreas de la ciudad.
              </p>
            </Grid>

            <Grid size={{ xs: 12, xl: 3, md:3, sm:4, lg:3}} sx={{ display: 'flex', justifyContent: 'center', zIndex: 1 }}>
              <Time />
            </Grid>
          </Grid>


          {/*Indicadores*/}
          {
            indicators
              .map(
                (indicator, idx) => (
                  <Grid key={idx} spacing={1} size={{ xs: 12, xl: 3, md:3, sm:6, lg:3 }} sx={{ flexGrow: 1 }}>
                    <IndicatorWeather
                      title={indicator["title"]}
                      subtitle={indicator["subtitle"]}
                      value={indicator["value"]} />
                  </Grid>
                )
              )
          }


          {/* Tabla */}
          <Grid size={{ xs: 12, xl: 8 }}>
            {/* Grid Anidado */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, xl: 3 }}>
                <ControlWeather />
              </Grid>
              <Grid size={{ xs: 12, xl: 9 }}>
                <TableWeather itemsIn={items} />
              </Grid>
            </Grid>
          </Grid>

          {/* Gráfico */}
          <Grid size={{ xs: 12, xl: 4 }}> <LineChartWeather /> </Grid>


        </Grid>
      </Grid >
    </>
  );
}

export default App
