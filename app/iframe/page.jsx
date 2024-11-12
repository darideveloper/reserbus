"use client"
import { useState, useEffect } from "react"

// Shadcn components
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Custom components
import Combobox from "@/components/Combobox"

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

  const fromRoutes = Object.keys(routes)
  const fromRoutesCombo = fromRoutes.map((route) => {
    return getValueLabel(route)
  })
  const [toRoutesCombo, setToRoutesCombo] = useState([])
  const [fromRouteSelected, setFromRouteSelected] = useState("")
  const [toRouteSelected, setToRouteSelected] = useState("")

  useEffect(() => {
    // Update toRoutesCombo when fromRouteSelected changes
    if (fromRouteSelected) {
      const toRoutes = routes[fromRouteSelected]
      const toRoutesCombo = toRoutes.map((route) => {
        return getValueLabel(route)
      })
      setToRoutesCombo(toRoutesCombo)
    }
  }, [fromRouteSelected])

  return (
    <Card className="w-11/12 p-4 m-4 mx-auto bg-white">
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">

            {/* From selector */}
            <Combobox
              initialText={"Selecciona tu origen"}
              placeholder={"Buscar por cuidad, provincia o pueblo"}
              noResultsText={"No se encontraron resultados"}
              options={fromRoutesCombo}
              value={fromRouteSelected}
              setValue={setFromRouteSelected}
            />

            {/* To selector */}
            <Combobox
              initialText={"Selecciona tu destino"}
              placeholder={"Buscar por cuidad, provincia o pueblo"}
              noResultsText={"No se encontraron resultados"}
              options={toRoutesCombo}
              value={toRouteSelected}
              setValue={setToRouteSelected}
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
