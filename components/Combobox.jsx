"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

/**
 * Combobox component
 * 
 * @param {object} props
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.initialText - Initial text before selecting an option
 * @param {string} props.noResultsText - Text to show when there are no results
 * @param {object[]} props.options - Array of options
 * @param {string} props.options[].value - Value of the option
 * @param {string} props.options[].label - Label of the option
 * @param {string} props.value - Current value
 * @param {function} props.setValue - Function to set the value
 * @param {string} props.iconName - Icon name
 */
export default function Combobox({
  placeholder,
  initialText,
  noResultsText,
  options,
  value,
  setValue,
  icon
}) {

  // Internal state
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span
            className={`flex align-center justify-start w-full gap-2 ${!value && "text-muted-foreground"}`}
          >
            {/* Render the dynamic icon if it exists */}
            {icon}

            {/* Render text */}
            {value
              ? options.find((option) => option.value === value)?.label
              : initialText}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`${placeholder}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>{noResultsText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
