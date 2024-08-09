import { gql } from 'graphql-request'

export const GET_ALL_ESL_FILED_OFFSETS = gql`
  query ($timeEntryId: Int!) {
    eslOffsetsByTimeEntry(timeEntryId: $timeEntryId) {
      id
      title
      timeIn
      timeOut
      createdAt
      updatedAt
      teamLeader {
        id
        name
      }
      userName
      description
      isLeaderApproved
      isUsed
    }
  }
`
export const GET_ALL_FILED_OFFSETS = gql`
  {
    allFiledOffsets {
      id
      title
      timeIn
      timeOut
      createdAt
      updatedAt
      teamLeader {
        id
        name
      }
      userName
      description
      isLeaderApproved
      isUsed
    }
  }
`
