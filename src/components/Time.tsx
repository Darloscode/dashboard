import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

import sunrise from '../assets/mañana.jpg'
import afternoon from '../assets/tarde.jpeg'
import evening from '../assets/noche.jpeg'

import { useEffect, useState } from 'react';

export default function Time() {

  const [dateInfo, setDateInfo] = useState({ date: '', time: '', wish: '' });
  const [image, setImage] = useState(sunrise)

  useEffect(() => {
    const locale = 'es';
    const updateDate = () => {
      const today = new Date();

      const day = today.toLocaleDateString(locale, { weekday: 'long' });
      const date = `${day[0].toUpperCase() + day.substring(1)}, ${today.getDate()} ${today.toLocaleDateString(locale, { month: 'long' })[0].toUpperCase() + today.toLocaleDateString(locale, { month: 'long' }).substring(1)}\n\n`;

      const hour = today.getHours();
      const wish = `${(hour < 12 && 'Buenos días!') || (hour < 17 && 'Buenas tardes!') || 'Buenas Noches!'}`;

      const time = today.toLocaleTimeString(locale, { hour: 'numeric', hour12: true, minute: 'numeric', second: 'numeric' });

      setDateInfo({ date, time, wish });

      if (hour < 12) {
        setImage(sunrise) 
      } else if (hour < 17) {
        setImage(afternoon)
      } else {
        setImage(evening)
      }


    };

    updateDate();

    const timer = setInterval(updateDate, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card sx={{ maxWidth: '345px', backgroundColor: 'white', borderRadius: '7px' }} elevation={5}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt="Amanecer"
        />
        <CardContent>
          <Typography gutterBottom component="h2" variant="h6" sx={{ fontWeight: 200, color: '#123f77' }}>
            {dateInfo.wish}
          </Typography>
          <Typography component="p" variant="h4">
            {dateInfo.time}
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            {dateInfo.date}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}