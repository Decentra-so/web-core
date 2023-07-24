import { Box, Typography } from '@mui/material'
import classNames from 'classnames'
import NetworkSelector from '@/components/common/NetworkSelector'

import type { ReactElement } from 'react'

import css from './styles.module.css'

const PageHeaderAddressBook = ({
  title,
  action,
  noBorder,
}: {
  title: string
  action?: ReactElement
  noBorder?: boolean
}): ReactElement => {
  return (
    <Box className={classNames(css.container, { [css.border]: !noBorder })}>
      <Box className={css.titlebox}>
      <Typography variant="h3" className={css.titleaddressbook}>
        {title}
      </Typography>
      <NetworkSelector />
      </Box>
      {action}
    </Box>
  )
}

export default PageHeaderAddressBook
