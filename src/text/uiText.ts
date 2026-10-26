const resourceNoun = (count: number) =>
  count === 1 ? 'resource' : 'resources'

export const UI_TEXT = {
  brandName: 'Gambit',
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
      name: 'Name',
      type: 'Type',
      provider: 'Provider',
      environment: 'Environment',
      criticality: 'Criticality',
      openIssues: 'Open issues',
    },
    selectResource: (name: string) => `Select ${name}`,
    selectAllShown: 'Select all shown resources',
    loading: 'Loading resources...',
    empty: 'There are no resources to display.',
    noResults: 'No resources match your search and filters.',
    selectedCount: (count: number) =>
      count === 0
        ? 'No resources selected'
        : `${count} ${resourceNoun(count)} selected`,
    hiddenSelectedCount: (count: number) => `${count} hidden by filters`,
    clearSelection: 'Clear selection',
    createApplication: 'Create Application',
    createDialog: {
      title: 'Create Application',
      subtitle: (count: number) =>
        `Group ${count} selected ${resourceNoun(count)}`,
      nameLabel: 'Application name',
      descriptionLabel: 'Description',
      optional: '(optional)',
      cancel: 'Cancel',
      submit: 'Create',
    },
  },
  applications: {
    navLabel: 'Applications',
    title: 'Applications',
    subtitle: 'View your applications and their resources',
    listLabel: 'Applications',
    resourceCount: (count: number) => `${count} ${resourceNoun(count)}`,
    connectedCount: (count: number) =>
      `${count} connected ${resourceNoun(count)}`,
    empty: {
      message:
        'No applications yet. Select resources and create an application to see it here.',
      link: 'Go to Resources',
    },
    selectPrompt: 'Select an application to view its resources.',
    notFound: {
      message:
        'Application not found. Applications are saved only in this browser tab and are cleared when it is closed.',
      link: 'Back to Applications',
    },
    graph: {
      applicationNodeLabel: 'Application',
      title: (name: string) => `${name} resource graph`,
      description: (name: string, count: number) =>
        `${name} is connected to ${count} ${resourceNoun(count)}.`,
      membersLabel: (name: string) => `${name} resources`,
      resourceDetails: (type: string, provider: string) =>
        `${type} · ${provider}`,
      memberSummary: (name: string, type: string, provider: string) =>
        `${name}: ${type} · ${provider}`,
    },
  },
  notFound: {
    title: 'Page not found',
    message: 'The page you are looking for does not exist.',
    backLink: 'Go to Resources',
  },
} as const
