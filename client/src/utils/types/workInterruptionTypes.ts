import { IInterruptionTimeEntry } from '../interfaces'

export type InterruptionType = {
  id: number
  name: string
}

export type WorkInterruptionType = {
  allWorkInterruptionTypes: Array<{
    createdAt: string
    timeEntryId: number
    workInterruptionType: { name: string }
    otherReason: string
    timeOut: string
    timeIn: string
    remarks: string
  }>
}

export type WorkInterruption = {
  id: number
  timeOut: string
  timeIn: string
  otherReason: string
  remarks: string
  workInterruptionType: InterruptionType
}
export type WorkInterruptions = {
  interruptionsByTimeEntryId: IInterruptionTimeEntry[]
  allWorkInterruptions: IInterruptionTimeEntry[]
}
