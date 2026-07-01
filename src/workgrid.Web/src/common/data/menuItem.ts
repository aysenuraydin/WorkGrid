export interface MenuItem {
  id: number;
  label: string;
  link?: string;
  icon?: string;
  visible: boolean;
  isHeader?: boolean;
  order?: number;
  parentId?: number | null;
  locked: boolean;
  isAdmin: boolean | null;
  badgeName?: string;
  badgeColor?: string;
}