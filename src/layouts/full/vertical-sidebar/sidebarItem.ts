export interface menu {
  header?: string;
  title?: string;
  icon?: string;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  {
    title: '面板',
    icon: 'mdi-view-dashboard',
    to: '/dashboard/default'
  },
  {
    title: '配置',
    icon: 'mdi-cog',
    to: '/config',
  },
  {
    title: '插件',
    icon: 'mdi-puzzle',
    to: '/extension'
  },
  {
    title: '控制台',
    icon: 'mdi-console',
    to: '/console'
  },
  {
    title: 'Project ATRI',
    icon: 'mdi-grain',
    to: '/project-atri'
  },
];

export default sidebarItem;
