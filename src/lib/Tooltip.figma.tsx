import figma from '@figma/code-connect'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=11-81'

figma.connect(Tooltip, URL, {
  example: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Trust signals</TooltipTrigger>
        <TooltipContent>Verified race history</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
})
