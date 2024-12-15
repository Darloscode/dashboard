import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect } from "react";

{ /*
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
]; */}
interface LineChartWeatherProps {
    value: number;
    dataGraphic: Array<{
        rangeHours: string;
        precipitation: string;
        humidity: string;
        clouds: string;
    }>;
}

export default function LineChartWeather({ value, dataGraphic }: LineChartWeatherProps) {

    let [ejex, setDatax] = useState<string[]>([]);
    let [ejey, setDatay] = useState<number[]>([]);
    let [labelSeleccion, setLabelSeleccion] = useState("");
    useEffect(() => {

        (async () => {

            {/* Procesar data */ }

            const processData: Array<[string, number]> = [];

            if (value == 0 || value == -1) {

                //processData[0].push("Precipitación")
                setLabelSeleccion("Precipitación")
                for (let item of dataGraphic) {
                    processData.push([item.rangeHours, parseFloat(item.precipitation)])
                }

            } else if (value == 1) {

                //processData[0].push("Humedad")
                setLabelSeleccion("Humedad")
                for (let item of dataGraphic) {
                    const humidity = await item.humidity.split(" ")[0]
                    processData.push([item.rangeHours, parseInt(humidity)])
                }

            } else if (value == 2) {

                //processData[0].push("Nubosidad")
                setLabelSeleccion("Nubosidad")
                for (let item of dataGraphic) {
                    const clouds = await item.clouds.split(" ")[2]
                    processData.push([item.rangeHours, parseInt(clouds)])
                }

            }

            {/*
          for(let item of dataGraphic) {
            const humidity = await item.humidity.split(" ")[0]
            const clouds = await item.clouds.split(" ")[2]
            processData.push([item.rangeHours, parseFloat(item.precipitation), parseInt(humidity), parseInt(clouds)])
          }
          */}

            const datosy = processData.map(fila => fila[1]);
            const datosx = processData.map(fila => fila[0]);

            // Lista para guardar los valores de datay correspondientes
            const seleccionadosx: string[] = [];
            const seleccionadosy: number[] = [];

            // Recorrer los elementos de datax y datay al mismo tiempo
            datosx.forEach((timeRange, index) => {
                // Verificar si el tiempo de inicio es '06:00:00'
                const partes = timeRange.split('T')
                if (partes[1].startsWith("06:00:00")) {
                    console.log(index, timeRange)
                    // Guardar el valor correspondiente de datay
                    seleccionadosx.push(partes[0]);
                    seleccionadosy.push(datosy[index]);
                }
            });
            setDatax(seleccionadosx);
            setDatay(seleccionadosy);
        })()

    }, [value, dataGraphic])

    return (
        <Paper
            sx={{
                pb: 3,
                display: 'flex',
                flexDirection: 'column'
            }}
            elevation={5}
        >

            {/* Componente para un gráfico de líneas 
                        <LineChart
                width={400}
                height={250}
                series={[
                    { data: pData, label: 'pv' },
                    { data: uData, label: 'uv' },
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
            />
        </Paper>
        */}
            <div style={{ width: "100%", height: "500px" }}>
                <LineChart
                    series={[
                        { curve: "catmullRom", data: ejey, label: labelSeleccion, area: true, baseline: 'min' },
                    ]}
                    xAxis={[{ scaleType: 'point', data: ejex }]}
                    grid={{ vertical: true, horizontal: true }}
                />
            </div>
        </Paper>
    );
}