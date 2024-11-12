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

// Data
import { routes } from "@/data/routes"

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
  const [toRouteSelected, setToRouteSelected] = useState("")
  const [departureDate, setDepartureDate] = useState(null)
  const [returnDate, setReturnDate] = useState(null)

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

  useEffect(() => {
    console.log(departureDate)
  }, [departureDate])

  return (
    <Card className="w-11/12 p-4 m-4 mx-auto bg-white">
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">

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
              placeholder={"Fecha de salida"}
              value={departureDate}
              setValue={setDepartureDate}
            />

            <DatePicker
              placeholder={"Fecha de regreso"}
              value={returnDate}
              setValue={setReturnDate}
            />

          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
}
