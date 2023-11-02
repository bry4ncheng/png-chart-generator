const axios = require('axios');

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
        console.log(req.body);
      const data = req.body;

      let labels = data.MonthEndBalance.map(item => item.Year_Month);
      labels.push(data.CurrentMonth.Year_Month);
      const dataPoints = data.MonthEndBalance.map(item => parseFloat(item.Balance));
      dataPoints.push(data.CurrentMonth.Balance);

      const chartConfig = {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Balance (EOM)',
              data: dataPoints,
              borderColor: 'blue',
              fill: false,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Balance (EOM)',
          },
          scales: {
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Date',
                },
              },
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: 'Balance',
                },
              },
            ],
          }
        },
      };

      const imageUrl = `https://quickchart.io/chart?w=300&h=200&backgroundColor=white&format=png&devicePixelRatio=3.5&c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      res.setHeader('Content-Type', 'image/png');
      res.send(imageResponse.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

