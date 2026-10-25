export const UI_TEXT = {
  appTitle: 'Cloud resources',
  navigationLabel: 'Main navigation',
  resources: {
    navLabel: 'Resources',
    title: 'Resources',
    subtitle: 'Browse resources and group them into applications',
    searchLabel: 'Search resources by name',
    searchPlaceholder: 'Search by name...',
    filters: {
      provider: 'Provider',
      environment: 'Environment',
      criticality: 'Criticality',
      all: 'All',
    },
    tableLabel: 'Cloud resources',
    columns: {
      select: 'Select',
      name: 'Name',
      type: 'Type',
      provider: 'Provider',
      environment: 'Environment',
      criticality: 'Criticality',
      openIssues: 'Open issues',
    },
    selectResource: (name: string) => `Select ${name}`,
    loading: 'Loading resources...',
    empty: 'There are no resources to display.',
    noResults: 'No resources match your search and filters.',
    selectedCount: (count: number) =>
      count === 0
        ? 'No resources selected'
        : `${count} ${count === 1 ? 'resource' : 'resources'} selected`,
    hiddenSelectedCount: (count: number) => `${count} hidden by filters`,
    clearSelection: 'Clear selection',
  },
  applications: {
    navLabel: 'Applications',
    title: 'Applications',
    subtitle: 'View your applications and their resources',
    selectedLabel: 'Selected application:',
  },
  notFound: {
    title: 'Page not found',
    message: 'The page you are looking for does not exist.',
    backLink: 'Go to Resources',
  },
} as const
