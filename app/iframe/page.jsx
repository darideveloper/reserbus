"use client"
import { useState, useEffect } from "react"

// Shadcn components
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { MapIcon, MapPinIcon } from "lucide-react"

// Custom components
import Combobox from "@/components/Combobox"
import DatePicker from "@/components/DatePicker"
import Counter from "@/components/Counter"

// Data
import { routes } from "@/data/routes"
import { phpSerializeAndEncode } from "@/lib/encoders"

// Extra functions
function getValueLabel(value) {
  return ({
    value: value,
    label: value,
  })
}

export default function Iframe() {

  // Form dynamic data
  const fromRoutes = Object.keys(routes)
  const fromRoutesCombo = fromRoutes.map((route) => {
    return getValueLabel(route)
  })
  const [toRoutesCombo, setToRoutesCombo] = useState([])
  const [noResultsToText, setNoResultsToText] = useState("No se encontraron resultados")

  // Form values
  const [fromRouteSelected, setFromRouteSelected] = useState("")
  const [formRouteError, setFormRouteError] = useState("")
  const [toRouteSelected, setToRouteSelected] = useState("")
  const [toRouteError, setToRouteError] = useState("")
  const [departureDate, setDepartureDate] = useState(null)
  const [departureDateError, setDepartureDateError] = useState("")
  const [returnDate, setReturnDate] = useState(null)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState([])
  const [seniors, setSeniors] = useState([])

  // Detect changes on fromRouteSelected
  useEffect(() => {
    // Update toRoutesCombo when fromRouteSelected changes
    if (fromRouteSelected) {
      const toRoutes = routes[fromRouteSelected]
      const toRoutesCombo = toRoutes.map((route) => {
        return getValueLabel(route)
      })
      setToRoutesCombo(toRoutesCombo)
    } else {
      // Change setNoResultsText when fromRouteSelected is empty
      setNoResultsToText("Elige un origen.")
    }
  }, [fromRouteSelected])

  /**
   * Format date to DD-MM-YYYY
   * 
   * @param {Date} date - Date object
   * @returns {string} Formatted date
   */
  function getFormatDate(date) {
    let day = String(date.getDate()).padStart(2, '0')
    let month = String(date.getMonth() + 1).padStart(2, '0')
    let year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

  /** Handle submit form and validate 
   * 
   * @param {Event} event
  */
  function handleSubmit(event) {

    event.preventDefault()
    let isError = false

    // Validate fields and show errors
    if (!fromRouteSelected) {
      isError = true
      setFormRouteError("Elige un origen.")
    }

    if (!toRouteSelected) {
      isError = true
      setToRouteError("Elige un destino.")
    }

    if (!departureDate) {
      isError = true
      setDepartureDateError("Elige una fecha de ida.")
    }


    if (!isError) {

      // Process and encode data
      const from = fromRouteSelected.toUpperCase()
      const to = toRouteSelected.toUpperCase()
      const departureDateStr = getFormatDate(departureDate)
      const returnDateStr = returnDate ? getFormatDate(returnDate) : "X"
      const passengers = adults + children.length + seniors.length
      let viajeros = []
      for (let i = 0; i < passengers; i++) {
        viajeros.push(`${i + 1}@1@0@0`)
      }
      let viajerosStr = viajeros.join("~")

      const data = {
        login: process.env.NEXT_PUBLIC_MOVELIA_LOGIN,
        pwd: '',
        pwdag: process.env.NEXT_PUBLIC_MOVELIA_PASSWORD,
        idioma: 'es',
        origenAg: from,
        destinoAg: to,
        tipoViaje: '1',
        fsalida: departureDateStr.replace("-", "_"),
        fregreso: returnDateStr.replace("-", "_"),
        viajeros: viajerosStr,
      }
      const encodedString = phpSerializeAndEncode(data)

      // Open link in new tab
      let link = `https://www.movelia.es/es/app/area-agencias/login?postData=${encodedString}&post_login=1`
      console.log({ data, encodedString, link })
      window.open(link, '_blank')
    }

  }

  return (
    <Card className="w-11/12 p-4 m-4 mx-auto bg-white">
      <CardContent className="pt-6">
        <form
          className={`
            flex
            flex-col
            gap-6
            items-center
            justify-center
          `}
          onSubmit={handleSubmit}
        >
          <div className="grid w-full items-center gap-4">

            <div
              className={`
                inputs wrapper
                grid
                grid-cols-1 md:grid-cols-2 lg:grid-cols-4
                gap-4
              `}
            >

              {/* From and to routes selectors */}
              <Combobox
                initialText={"Selecciona tu origen"}
                placeholder={"Buscar por cuidad, provincia o pueblo"}
                noResultsText={"No se encontraron resultados"}
                options={fromRoutesCombo}
                value={fromRouteSelected}
                setValue={setFromRouteSelected}
                icon={<MapIcon />}
              />

              <Combobox
                initialText={"Selecciona tu destino"}
                placeholder={"Buscar por cuidad, provincia o pueblo"}
                noResultsText={noResultsToText}
                options={toRoutesCombo}
                value={toRouteSelected}
                setValue={setToRouteSelected}
                icon={<MapPinIcon />}
              />

              {/* Departure and return dates */}
              <DatePicker
                placeholder={"Fecha ida"}
                value={departureDate}
                setValue={setDepartureDate}
              />

              <DatePicker
                placeholder={"Fecha de vuelta"}
                value={returnDate}
                setValue={setReturnDate}
              />
            </div>

            {/* Passangers */}
            <div
              className={`
                counters-wrapper
                grid
                grid-cols-1 md:grid-cols-3
                items-start
                justify-center
                gap-4
                max-w-3xl
                mx-auto
              `}
            >

              {/* Adults counter */}
              <div className="adults-wrapper">
                <Counter
                  title="Adultos"
                  value={adults}
                  setValue={setAdults}
                  minValue={1}
                />
              </div>

              {/* Childs counter */}
              <div className="childs-wrapper flex flex-col gap-6">
                <Counter
                  title="Niños"
                  value={children.length}
                  setValue={(value) => {
                    if (value > children.length) {
                      // Add new children age
                      setChildren(children.concat(1))
                    } else {
                      // Remove last children age
                      setChildren(children.slice(0, -1))
                    }
                  }}
                />
                {
                  children.map((age, index) => (
                    <Counter
                      key={index}
                      title={`Edad del niño ${index + 1}`}
                      value={age}
                      setValue={(value) => {
                        // Replace old age with new age
                        const newAges = [...children]
                        newAges[index] = value
                        setChildren(newAges)
                      }}
                      minValue={1}
                      className="scale-90"
                      inputEditable={true}
                    />
                  ))
                }
              </div>

              {/* Seniors counter */}
              <div className="childs-wrapper flex flex-col gap-6">
                <Counter
                  title="Adultos mayores"
                  value={seniors.length}
                  setValue={(value) => {
                    if (value > seniors.length) {
                      // Add new seniors age
                      setSeniors(seniors.concat(60))
                    } else {
                      // Remove last seniors age
                      setSeniors(seniors.slice(0, -1))
                    }
                  }}
                />
                {
                  seniors.map((age, index) => (
                    <Counter
                      key={index}
                      title={`Edad del adulto ${index + 1}`}
                      value={age}
                      setValue={(value) => {
                        // Replace old age with new age
                        const newAges = [...seniors]
                        newAges[index] = value
                        setSeniors(newAges)
                      }}
                      minValue={60}
                      className="scale-90"
                      inputEditable={true}
                    />
                  ))
                }
              </div>


            </div>


          </div>
          <Button
            className={`
            w-full
            max-w-3xl
          `}
          >
            Buscar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
