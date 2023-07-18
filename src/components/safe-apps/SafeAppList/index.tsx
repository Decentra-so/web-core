import type { SafeAppData } from '@safe-global/safe-gateway-typescript-sdk'
import classnames from 'classnames'
import AddCustomSafeAppCard from '@/components/safe-apps/AddCustomSafeAppCard'
import type { SafeAppsViewMode } from '@/components/safe-apps/SafeAppCard'
import SafeAppCard, { GRID_VIEW_MODE } from '@/components/safe-apps/SafeAppCard'
import SafeAppsFilters from '@/components/safe-apps/SafeAppsFilters'
import SafeAppsListHeader from '@/components/safe-apps/SafeAppsListHeader'
import SafeAppsZeroResultsPlaceholder from '@/components/safe-apps/SafeAppsZeroResultsPlaceholder'
import useSafeAppsFilters from '@/hooks/safe-apps/useSafeAppsFilters'
import useLocalStorage from '@/services/local-storage/useLocalStorage'
import { Skeleton } from '@mui/material'
import css from './styles.module.css'

type SafeAppListProps = {
  safeAppsList: SafeAppData[]
  safeAppsListLoading?: boolean
  bookmarkedSafeAppsId?: Set<number>
  onBookmarkSafeApp?: (safeAppId: number) => void
  showFilters?: boolean
  addCustomApp?: (safeApp: SafeAppData) => void
  removeCustomApp?: (safeApp: SafeAppData) => void
}

const unusableApps = [
  '1inch Network', 'Alkemi Earn', 'Bulla Banker', 'Bunni', 'Cask Protocol', 'Centrifuge', 'dHEDGE', 'DODO',
  'dump.services', 'ETH Staking by P2P.org', 'ENS - Ethereum Name Service', 'Exactly', 'Furucombo', 'Harvest Finance',
  'Hop Protocol', 'Index', 'Instadapp', 'Integral', 'Migratooor', 'Morpho-Aave', 'Morpho-Compound', 'NFTMigratooor', 'Oasis',
  'OpenOcean', 'OtoCo', 'OtoCo', 'Pirex', 'Request Finance', 'Rocket Pool', 'Silo Finance', 'Snapshot', 'StakeDAO',  'Squid',
  'Timeless Finance', 'Yearn', 'Zerion',
]

const VIEW_MODE_KEY = 'SafeApps_viewMode'

const SafeAppList = ({
  safeAppsList,
  safeAppsListLoading,
  bookmarkedSafeAppsId,
  onBookmarkSafeApp,
  showFilters,
  addCustomApp,
  removeCustomApp,
  modal
}: SafeAppListProps & { modal?: boolean }) => {
  const [safeAppsViewMode = GRID_VIEW_MODE, setSafeAppsViewMode] = useLocalStorage<SafeAppsViewMode>(VIEW_MODE_KEY)

  const { filteredApps, query, setQuery, setSelectedCategories, setOptimizedWithBatchFilter, selectedCategories } =
    useSafeAppsFilters(safeAppsList)
  const showZeroResultsPlaceholder = query && filteredApps.length === 0

  const navigateToSafeApp = (safeAppUrl: string, router: any) => {
    router.push(safeAppUrl)
  }

  return (
    <>
      {/* Safe Apps Filters */}
      {showFilters && (
        <SafeAppsFilters
          modal={modal}
          onChangeQuery={setQuery}
          onChangeFilterCategory={setSelectedCategories}
          onChangeOptimizedWithBatch={setOptimizedWithBatchFilter}
          selectedCategories={selectedCategories}
          safeAppsList={safeAppsList}
        />
      )}
      {/* Safe Apps List Header */}
      <SafeAppsListHeader
        modal={true}
        amount={filteredApps.length}
        safeAppsViewMode={safeAppsViewMode}
        setSafeAppsViewMode={setSafeAppsViewMode}
      />

      {/* Safe Apps List */}
      <ul
        className={classnames(
          css.safeAppsContainer,
          safeAppsViewMode === GRID_VIEW_MODE ? css.safeAppsGridViewContainer : css.safeAppsListViewContainer,
        )}
      >
        {/* Add Custom Safe App Card */}
        {addCustomApp && (
          <li>
            <AddCustomSafeAppCard safeAppList={safeAppsList} onSave={addCustomApp} />
          </li>
        )}

        {safeAppsListLoading &&
          Array.from({ length: 8 }, (_, index) => (
            <li key={index}>
              <Skeleton variant="rounded" height="271px" />
            </li>
          ))}

        {/* Flat list filtered by search query */}
        {filteredApps.filter((app) => !unusableApps.includes(app.name)).map((safeApp) => (
          <li key={safeApp.id}>
            <SafeAppCard
              safeApp={safeApp}
              viewMode={safeAppsViewMode}
              isBookmarked={bookmarkedSafeAppsId?.has(safeApp.id)}
              onBookmarkSafeApp={onBookmarkSafeApp}
              removeCustomApp={removeCustomApp}
              onClickSafeApp={navigateToSafeApp}
            />
          </li>
        ))}
      </ul>

      {/* Zero results placeholder */}
      {showZeroResultsPlaceholder && <SafeAppsZeroResultsPlaceholder searchQuery={query} />}
    </>
  )
}

export default SafeAppList