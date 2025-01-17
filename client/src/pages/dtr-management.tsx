import moment from 'moment'
import { NextPage } from 'next'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { PulseLoader } from 'react-spinners'
import React, { useEffect, useState } from 'react'
import { CSVLink } from 'react-csv'
import useInterruptionType from '~/hooks/useInterruptionType'
import useFileOffset from '~/hooks/useFileOffset'

import NotFound from './404'
import useUserQuery from '~/hooks/useUserQuery'
import { Roles } from '~/utils/constants/roles'
import Layout from '~/components/templates/Layout'
import LegendTooltip from '~/components/molecules/LegendTooltip'
import DTRTable from '~/components/molecules/DTRManagementTable'
import DTRSummaryTable from '~/components/molecules/DTRSummaryTable'
import GlobalSearchFilter from '~/components/molecules/GlobalSearchFilter'
import { columns } from '~/components/molecules/DTRManagementTable/columns'
import SummaryMenuDropdown from '~/components/molecules/SummaryMenuDropdown'
import TimeSheetFilterDropdown from '~/components/molecules/TimeSheetFilterDropdown'
import { getAllEmployeeTimesheet, getTimesheetSummary } from '~/hooks/useTimesheetQuery'
import { columns as dtrSummaryColumns } from '~/components/molecules/DTRSummaryTable/columns'

export type Filters = {
  date: string
  status: string
  startDate: string
  endDate: string
}

export type QueryVariablesType = {
  date: string
  status: string | null
  startDate: string | null
  endDate: string | null
}

type URLParameterType =
  | {
      startDate: string
      endDate: string
      summary: boolean
      searchKey: string
    }
  | {
      date: string
      status: string
      summary: boolean
      searchKey: string
    }

const DTRManagement: NextPage = (): JSX.Element => {
  const router = useRouter()
  const { query } = router

  const { handleUserQuery } = useUserQuery()
  const { data: currentUser } = handleUserQuery()

  const [isOpenSummaryTable, setIsOpenSummaryTable] = useState<boolean>(false)
  const [fetchReady, setFetchReady] = useState<boolean>(false)
  const handleToggleSummaryTable = (): void => {
    handleURLParameterChange(
      !isOpenSummaryTable
        ? {
            startDate: filters.startDate,
            endDate: filters.endDate,
            summary: true,
            searchKey: globalFilter
          }
        : {
            date: filters.date,
            status: filters.status,
            summary: false,
            searchKey: globalFilter
          }
    )
    setIsOpenSummaryTable(!isOpenSummaryTable)
  }
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [filters, setFilters] = useState({
    date: moment().format('YYYY-MM-DD'),
    status: '',
    startDate:
      new Date().getDate() > 15 ? moment().format('YYYY-MM-16') : moment().format('YYYY-MM-01'),
    endDate:
      new Date().getDate() > 15
        ? moment().endOf('month').format('YYYY-MM-DD')
        : moment().format('YYYY-MM-15')
  })

  const queryVariables: QueryVariablesType = {
    date: filters.date,
    status: filters.status !== '' ? filters.status : null,
    startDate: filters.startDate,
    endDate: filters.endDate
  }

  const allEmployee = getAllEmployeeTimesheet(
    '$date: String, $status: String',
    'date: $date, status: $status',
    queryVariables,
    fetchReady
  )

  const summary = getTimesheetSummary(
    '$startDate: String, $endDate:String',
    'startDate: $startDate, endDate: $endDate',
    queryVariables,
    fetchReady
  )

  const [fetchedAllEmployeeData, setFetchedAllEmployeeData] = useState({
    data: allEmployee.data,
    error: allEmployee.error,
    isLoading: allEmployee.isLoading
  })

  const [fetchedSummaryData, setFetchedSummaryData] = useState({
    data: summary.data,
    error: summary.error,
    isLoading: summary.isLoading
  })

  const handleURLParameterChange = (query: URLParameterType): void => {
    void router.replace({
      pathname: '/dtr-management',
      query
    })
  }

  const handleFilterUpdate = (): void => {
    if (isOpenSummaryTable) {
      handleURLParameterChange({
        startDate: filters.startDate,
        endDate: filters.endDate,
        summary: true,
        searchKey: globalFilter
      })
      setFetchedSummaryData({ ...fetchedSummaryData, isLoading: true })
      void summary.refetch().then((response) => {
        setFetchedSummaryData({
          data: response.data,
          error: response.error,
          isLoading: response.isLoading
        })
      })
    } else {
      handleURLParameterChange({
        date: filters.date,
        status: filters.status,
        summary: false,
        searchKey: globalFilter
      })
      setFetchedAllEmployeeData({ ...fetchedAllEmployeeData, isLoading: true })
      void allEmployee.refetch().then((response) => {
        setFetchedAllEmployeeData({
          data: response.data,
          error: response.error,
          isLoading: response.isLoading
        })
      })
    }
  }

  const { useAllWorkInterruptions } = useInterruptionType()
  const workInterruption = useAllWorkInterruptions()

  const [fetchedWorkInterruptionsData, setFetchedWorkInterruptionsData] = useState({
    data: workInterruption.data,
    error: workInterruption.error,
    isLoading: workInterruption.isLoading
  })

  const { getAllFiledOffsetsQuery } = useFileOffset()
  const filedOffset = getAllFiledOffsetsQuery()

  const [fetchedFiledOffsetData, setFetchedFiledOffsetData] = useState({
    data: filedOffset.data,
    error: filedOffset.error,
    isLoading: filedOffset.isLoading
  })

  const setFetchedData = (data: any, setState: any): void => {
    if (data !== undefined) {
      setState({
        data: data.data,
        error: data.error,
        isLoading: data.isLoading
      })
    }
  }
  const getSummaryFilename = (): string => {
    const startDate = moment(filters.startDate)
    const endDate = moment(filters.endDate)
    const dateRange =
      startDate.date() === 1 && endDate.date() === 15
        ? '1-15'
        : startDate.date() === 16
        ? '16-31'
        : `${startDate.date()}-${endDate.date()}`
    return `Summary-${startDate.format('MMM-YYYY')}-(${dateRange}).csv`
  }

  useEffect(() => {
    if (router.isReady) {
      if (isOpenSummaryTable) {
        handleURLParameterChange({
          startDate: filters.startDate,
          endDate: filters.endDate,
          summary: true,
          searchKey: globalFilter
        })
      } else {
        handleURLParameterChange({
          date: filters.date,
          status: filters.status,
          summary: false,
          searchKey: globalFilter
        })
      }
    }
  }, [globalFilter])

  useEffect(() => {
    if (router.isReady) {
      query.searchKey !== undefined && setGlobalFilter(query.searchKey as string)
      setFilters({
        ...filters,
        date: (query.date as string) ?? filters.date,
        status: (query.status as string) ?? filters.status,
        startDate: (query.startDate as string) ?? filters.startDate,
        endDate: (query.endDate as string) ?? filters.endDate
      })
      setIsOpenSummaryTable(query.summary === 'true')
    }
  }, [router.isReady])

  useEffect(() => {
    if (router.isReady) setFetchReady(true)
  }, [router.isReady, filters])

  useEffect(() => {
    setFetchedData(allEmployee, setFetchedAllEmployeeData)
  }, [allEmployee.data])

  useEffect(() => {
    setFetchedData(summary, setFetchedSummaryData)
  }, [summary.data])

  useEffect(() => {
    setFetchedWorkInterruptionsData({
      data: workInterruption.data,
      error: workInterruption.error,
      isLoading: workInterruption.isLoading
    })
  }, [workInterruption.data, workInterruption.error, workInterruption.isLoading])

  useEffect(() => {
    setFetchedFiledOffsetData({
      data: filedOffset.data,
      error: filedOffset.error,
      isLoading: filedOffset.isLoading
    })
  }, [filedOffset.data, filedOffset.error, filedOffset.isLoading])

  if (process.env.NODE_ENV === 'production' && currentUser?.userById.role.name !== Roles.HR_ADMIN) {
    return <NotFound />
  }

  const SummaryHeaders = [
    { label: 'Name', key: 'user.name' },
    { label: 'Leave(days)', key: 'leave' },
    { label: 'Abscenses', key: 'absences' },
    { label: 'Late', key: 'late' },
    { label: 'Undertime(min)', key: 'undertime' },
    { label: 'Overtime(min)', key: 'overtime' }
  ]
  const DTRheaders = [
    { label: 'Date', key: 'date' },
    { label: 'Name', key: 'user.name' },
    { label: 'Status', key: 'status' },
    { label: 'Time In', key: 'timeIn.timeHour' },
    { label: 'Time In Remarks', key: 'timeIn.remarks' },
    { label: 'Time Out', key: 'timeOut.timeHour' },
    { label: 'Time Out Remarks', key: 'timeOut.remarks' },
    { label: 'Start Time', key: 'startTime' },
    { label: 'End Time', key: 'endTime' },
    { label: 'Work Hours', key: 'workedHours' },
    { label: 'Late(min)', key: 'late' },
    { label: 'Undertime(min)', key: 'undertime' },
    { label: 'Overtime(min)', key: 'overtime.approvedMinutes' }
  ]

  const InterruptionHeader = [
    { label: 'Name', key: 'userName' },
    { label: 'ID', key: 'id' },
    { label: 'Time Out', key: 'timeOut' },
    { label: 'Time In', key: 'timeIn' },
    { label: 'Other Reason', key: 'otherReason' },
    { label: 'Remarks', key: 'remarks' },
    { label: 'Work Interruption Type ID', key: 'workInterruptionTypeId' },
    { label: 'Work Interruption Type', key: 'workInterruptionType.name' },
    { label: 'Time Entry ID', key: 'timeEntryId' },
    { label: 'Created At', key: 'createdAt' }
  ]

  const FiledOffsetHeader = [
    { label: 'Name', key: 'userName' },
    { label: 'Title', key: 'title' },
    { label: 'Time Out', key: 'timeOut' },
    { label: 'Time In', key: 'timeIn' },
    { label: 'Team Leader', key: 'teamLeader.name' },
    { label: 'Status', key: 'isLeaderApproved' },
    { label: 'Is Used', key: 'isUsed' },
    { label: 'Remarks', key: 'description' }
  ]

  return (
    <Layout metaTitle="DTR Management">
      <section className="default-scrollbar relative h-full min-h-full overflow-auto text-xs text-slate-800">
        <div className="sticky top-0 z-20 block bg-slate-100 md:hidden">
          <div className="flex items-center space-x-2 border-b border-slate-200 px-4 py-2">
            <h1 className="text-base font-semibold text-slate-700">DTR Management</h1>
            <LegendTooltip
              {...{
                placement: 'bottom'
              }}
            />
          </div>
        </div>
        <header
          className={classNames(
            'sticky top-[41px] left-0 z-20 px-4 py-2 md:top-0',
            'border-b border-slate-200 bg-slate-100'
          )}
        >
          <div className="flex items-center justify-between">
            <GlobalSearchFilter
              value={globalFilter ?? ''}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search"
            />
            <div className="flex items-center space-x-2 text-slate-500">
              <div className="fixed right-[500px] z-50">
                <TimeSheetFilterDropdown
                  filters={filters}
                  setFilters={setFilters}
                  handleFilterUpdate={handleFilterUpdate}
                  isOpenSummaryTable={isOpenSummaryTable}
                />
              </div>
              <SummaryMenuDropdown
                {...{
                  isOpenSummaryTable,
                  actions: {
                    handleToggleSummaryTable
                  }
                }}
              />

              <CSVLink
                data={
                  isOpenSummaryTable
                    ? fetchedSummaryData.data?.timesheetSummary ?? []
                    : fetchedAllEmployeeData.data?.timeEntries ?? []
                }
                headers={isOpenSummaryTable ? SummaryHeaders : DTRheaders}
                filename={isOpenSummaryTable ? getSummaryFilename() : `DTR_${filters.date}`}
              >
                <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
                  Export DTR
                </button>
              </CSVLink>

              <CSVLink
                data={fetchedWorkInterruptionsData.data?.allWorkInterruptions ?? []}
                headers={InterruptionHeader}
                filename={`Work_Interruption_${filters.date}.csv`}
              >
                <button className="rounded bg-red-500 px-4 py-2 text-white hover:bg-blue-700">
                  Export Work Interuption
                </button>
              </CSVLink>
              <CSVLink
                data={fetchedFiledOffsetData.data?.allFiledOffsets ?? []}
                headers={FiledOffsetHeader}
                filename={`FiledOffset_${filters.date}.csv`}
              >
                <button className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-blue-700">
                  Export FiledOffset
                </button>
              </CSVLink>
            </div>
          </div>
        </header>

        {!fetchedAllEmployeeData.isLoading &&
        fetchedAllEmployeeData.data !== undefined &&
        !fetchedSummaryData.isLoading ? (
          <>
            {!isOpenSummaryTable ? (
              <DTRTable
                {...{
                  query: {
                    data: fetchedAllEmployeeData.data.timeEntries,
                    isLoading: fetchedAllEmployeeData.isLoading,
                    error: fetchedAllEmployeeData.error
                  },
                  table: {
                    columns,
                    globalFilter,
                    setGlobalFilter
                  }
                }}
              />
            ) : (
              fetchedSummaryData.data !== undefined && (
                <DTRSummaryTable
                  {...{
                    query: {
                      data: fetchedSummaryData.data.timesheetSummary,
                      isLoading: fetchedAllEmployeeData.isLoading,
                      error: fetchedAllEmployeeData.error
                    },
                    table: {
                      columns: dtrSummaryColumns,
                      globalFilter,
                      setGlobalFilter
                    }
                  }}
                />
              )
            )}
          </>
        ) : allEmployee.error === null ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <PulseLoader color="#ffb40b" size={10} />
          </div>
        ) : (
          <div className="bg-rose-50">
            <p className="w-full py-2 text-center font-medium  text-rose-500">
              Something went wrong
            </p>
          </div>
        )}
      </section>
    </Layout>
  )
}

export default DTRManagement
