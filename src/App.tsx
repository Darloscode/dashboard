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

interface DataItem {
  rangeHours: string;       // Rango de horas como cadena de texto
  windDirection: string;    // Dirección del viento
  precipitation: string;    // Precipitación en algún formato (probablemente mm)
  humidity: string;         // Humedad como porcentaje
  clouds: string;           // Descripción y porcentaje de nubes
}

function App() {
  {/* Variable de estado y función de actualización */ }
  let [items, setItems] = useState<Item[]>([]);
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))

  /*Agregado*/
  let [tunnel, setTunnel] = useState<number>(0);
  let [dataGraphic, setDataGraphic] = useState<DataItem[]>([]);

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

        let locationNode = xml.getElementsByTagName("location")[0];

        let country = locationNode.getElementsByTagName("country")[0]?.innerHTML || "";
        dataToIndicators.push({ "title": "Location", "subtitle": "País", "value": country });

        let timezone = locationNode.getElementsByTagName("timezone")[0]?.innerHTML || "";
        dataToIndicators.push({ "title": "Location", "subtitle": "Zona Horaria", "value": timezone });


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
          let temperature = timeElement.getElementsByTagName("temperature")[0]?.getAttribute("value") || "0";
          let visibility = timeElement.getElementsByTagName("visibility")[0]?.getAttribute("value") || "0";

          dataToItems.push({
            dateStart, dateEnd, precipitation, humidity, clouds, temperature, visibility
          });
        });

        setItems(dataToItems);

        let arrayObjects = Array.from(xml.getElementsByTagName("time")).map((timeElement) => {
          let rangeHours = '';
          if (timeElement) {
            const from = timeElement.getAttribute("from");
            const to = timeElement.getAttribute("to");

            // Verificar que `from` y `to` no sean null
            if (from && to) {
              rangeHours = from + " - " + to.split("T")[1];
            }
          }

          let windDirection = timeElement.getElementsByTagName("windDirection")[0].getAttribute("deg") + " " + timeElement.getElementsByTagName("windDirection")[0].getAttribute("code")

          let precipitation = timeElement.getElementsByTagName("precipitation")[0]?.getAttribute("probability")??""

          let humidity = timeElement.getElementsByTagName("humidity")[0].getAttribute("value") + " " + timeElement.getElementsByTagName("humidity")[0].getAttribute("unit")

          let clouds = timeElement.getElementsByTagName("clouds")[0].getAttribute("value") + ": " + timeElement.getElementsByTagName("clouds")[0].getAttribute("all") + " " + timeElement.getElementsByTagName("clouds")[0].getAttribute("unit")

          return {
            "rangeHours": rangeHours,
            "windDirection": windDirection,
            "precipitation": precipitation,
            "humidity": humidity,
            "clouds": clouds
          }

        })
        setDataGraphic(arrayObjects)
      }

    }
    request();

  }, [owm])


  /*const [count, setCount] = useState(0)*/
  return (
    <>
      <Grid container className="app-container" >

        {/* Barra de navegación */}
        <Grid size={{ sm: 0, xs: 1, xl: 0, md: 1 }} className="navbar-container">
          <NavBar />
        </Grid>

        {/* Inicio */}
        <Grid container spacing={1} className="main-content-container" >
          <h2></h2>
          <Grid container size={{ xs: 12, xl: 12, md: 12 }} id="inicio" sx={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Grid size={{ xs: 12, xl: 9, md: 9, sm: 8, lg: 9 }} sx={{ textAlign: 'left', color: 'white' }}>
              <h2 className='section-title'>Bienvenido a GuayasTime</h2>
              <p className='section-text'>Guayaquil tiene un clima tropical cálido y
                húmedo durante todo el año, con temperaturas que oscilan entre 23°C y 31°C.
                La ciudad experimenta dos estaciones principales: una lluviosa, de enero a mayo,
                caracterizada por fuertes lluvias y alta humedad, y una seca, de junio a diciembre,
                con un ambiente más fresco y brisas agradables. Este clima la convierte en un destino
                cálido y acogedor en cualquier época del año.</p>
            </Grid>
            <Grid size={{ xs: 12, xl: 3, md: 3, sm: 4, lg: 3 }} sx={{ display: 'flex', justifyContent: 'center', zIndex: 1 }}>
              <Time />
            </Grid>
          </Grid>

          {/*Indicadores*/}
          <Grid container id="indicadores" size={{ xs: 12, xl: 12 }} spacing={3} >
            <Grid size={{ xs: 12, xl: 12, md: 12, sm: 12, lg: 12 }}>
              <h2 className='section-title'>Detalles de Guayaquil</h2>
              <p className='section-text'>
                Los indicadores de localización proporcionan información esencial sobre la ubicación específica dentro de la ciudad de Guayaquil para la que se están mostrando los datos climáticos. Estos indicadores son cruciales para ofrecer una perspectiva precisa y detallada del clima, ya que las condiciones meteorológicas pueden variar significativamente entre diferentes áreas de la ciudad.
              </p>
            </Grid>

            {
              indicators
                .map(
                  (indicator, idx) => (
                    <Grid key={idx} spacing={1} size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }} sx={{ flexGrow: 1 }}>
                      <IndicatorWeather
                        title={indicator["title"]}
                        subtitle={indicator["subtitle"]}
                        value={indicator["value"]} />
                    </Grid>
                  )
                )
            }
          </Grid>

          {/* Tabla */}
          <Grid size={{ xs: 12, xl: 12 }} id="historial" sx={{ mt: 6 }}>
            {/* Grid Anidado */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, xl: 12, md: 12, sm: 12, lg: 12 }}>
                <h2 className='section-title'>Historial de Guayaquil</h2>
                <p className='section-text'> La siguiente tabla presenta un historial detallado del clima
                  en Guayaquil, incluyendo datos clave como la temperatura, la humedad y el nivel de nubosidad.
                  Estos registros permiten analizar las variaciones climáticas de la ciudad, ofreciendo información
                  precisa y actualizada para comprender mejor su comportamiento atmosférico </p>
              </Grid>
              <Grid size={{ xs: 12, xl: 12 }}>
                <TableWeather itemsIn={items} />
              </Grid>
            </Grid>
          </Grid>

          {/* Gráfico */}
          <Grid container size={{ xs: 12, xl: 12 }} spacing={3} id="grafico" sx={{ mt: 6 }}>
            <Grid size={{ xs: 12, xl: 6, md: 9, sm: 9, lg: 12 }}>
              <h2 className='section-title'>Gráficos Meteorológicos</h2>
              <p className='section-text'> La siguiente tabla presenta un historial detallado del clima
                en Guayaquil, incluyendo datos clave como la temperatura, la humedad y el nivel de nubosidad.
                Estos registros permiten analizar las variaciones climáticas de la ciudad, ofreciendo información
                precisa y actualizada para comprender mejor su comportamiento atmosférico </p>
            </Grid>
            <Grid size={{ xs: 12, xl: 6 }}> <ControlWeather setValue={(value: number) => setTunnel(value)} /> </Grid>
            <Grid size={{ xs: 12, xl: 12 }}> <LineChartWeather value={tunnel} dataGraphic={dataGraphic} /> </Grid>
          </Grid>
        </Grid>
      </Grid >
    </>
  );
}

export default App
