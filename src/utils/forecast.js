const request = require('request')

const forecast = (latitude, longitude, cb) => {
    const url = `http://api.weatherstack.com/current?access_key=d70c99505beda1f29c13b38f2adb1078&query=${latitude},${longitude}&units=f`

    request({ url, json: true }, (err, { body }) => {
        if (err) {
            cb('Unable to connect weather service!', undefined)
        } else if (body.err) {
            cb('Unable to find location', undefined)
        } else {
            cb(undefined, `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees out. It feels like ${body.current.feelslike} degrees out.`)
        }
    })
}

module.exports = forecast