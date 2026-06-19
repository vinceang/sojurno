import figma from '@figma/code-connect'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=11-77'

figma.connect(Select, URL, {
  example: () => (
    <Select defaultValue="recommended">
      <SelectTrigger aria-label="Sort listings">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recommended">Recommended</SelectItem>
        <SelectItem value="price">Price: low to high</SelectItem>
        <SelectItem value="rating">Top rated</SelectItem>
      </SelectContent>
    </Select>
  ),
})
