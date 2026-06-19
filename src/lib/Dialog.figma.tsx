import figma from '@figma/code-connect'
import { Button } from './Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './Dialog'

const URL = 'https://www.figma.com/design/A3mcfYDq5wZ7As46yri9jO/Sojurno-Design-System?node-id=11-84'

figma.connect(Dialog, URL, {
  example: () => (
    <Dialog>
      <DialogTrigger>Request to book</DialogTrigger>
      <DialogContent>
        <DialogTitle>Confirm your request</DialogTitle>
        <DialogDescription>Send your stay request to the host for review?</DialogDescription>
        <DialogClose>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <Button variant="accent">Send request</Button>
      </DialogContent>
    </Dialog>
  ),
})
