import gql from 'graphql-tag';

export const CHANNEL_FRAGMENT = gql`
  fragment ChannelFragment on Channel {
    name,
    type,
    type_name,
    id,
    active
  }
`

export const CHANNEL_SUBSCRIPTION = gql`
  subscription onChannelAdded {
    channelAdded {
      ...ChannelFragment
    }
  }
  ${CHANNEL_FRAGMENT}
`

export const PAGINATED_CHANNELS = gql`
  query PaginatedChannelsQuery ($page: Int, $pageSize: Int) {
    channels(page: $page, pageSize: $pageSize) {
      entries {
        ...ChannelFragment
      },
      totalEntries,
      totalPages,
      pageSize,
      pageNumber
    }
  }
  ${CHANNEL_FRAGMENT}
`
