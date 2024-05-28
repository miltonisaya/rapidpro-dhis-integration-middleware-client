export interface MenuItemsApiResponse {
  data: {
    availableMenuItems: AvailableMenuItem[];
    selectedMenuItems: SelectedMenuItem[];
  };
  page: number;
  size: number;
  status: number;
  total: number;
  message: string;
}

export interface SelectedMenuItem {
  uuid: string;
  name: string;
  url: string;
  sortOrder: number;
  icon: string;
}

export interface AvailableMenuItem {
  uuid: string;
  name: string;
  url: string;
  sortOrder: number;
  icon: string;
}
