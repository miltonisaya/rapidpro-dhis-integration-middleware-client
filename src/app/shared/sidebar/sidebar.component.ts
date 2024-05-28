import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  NO_ERRORS_SCHEMA,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDivider } from '@angular/material/divider';

import { NgFor, NgIf } from '@angular/common';
import {MatListItem} from "@angular/material/list";
import {RouterLink} from "@angular/router";
import {FlexModule} from "@angular/flex-layout";

/**
 * @title Accordion with expand/collapse all toggles
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDivider,
    MatExpansionPanel,
    NgFor,
    NgIf,
    MatListItem,
    RouterLink,
    FlexModule,
  ],
})
export class SidebarComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  menus: any[];

  ngOnInit(): void {
    this.menus = [
      {
        id: 'a4fb400d-e0ef-45bc-b525-a27bef15fe74',
        name: 'Dashboard',
        icon: 'dashboard',
        url: 'dashboard',
        sortOrder: 1,
        children: [],
      },
      {
        id: '0bbeeaa6-e8a4-4862-ae7f-74edffd3960f',
        name: 'Security',
        icon: 'security',
        url: '',
        sortOrder: 1,
        children: [
          {
            id: '62f15367-03c8-4601-9d12-c4dea7f1c5d4',
            name: 'Menu Groups',
            icon: 'menus',
            url: 'menu-groups',
            sortOrder: 5,
            children: [],
          },
          {
            id: '62f15367-03c8-4601-9d12-c4dea7k1c5d6',
            name: 'Menu Items',
            icon: 'menu_open',
            url: 'menu-items',
            sortOrder: 6,
            children: [],
          },
          {
            id: '056cc8b2-44b0-4e17-a7d2-dbaff8aba176',
            name: 'Roles',
            icon: 'groups',
            url: 'roles',
            sortOrder: 4,
            children: [],
          },
          {
            id: 'b9032ad0-c915-49ab-ad09-9d37f418c5d9',
            name: 'Users',
            icon: 'person',
            url: 'users',
            sortOrder: 5,
            children: [],
          },
          {
            id: 'b86e0790-3563-4da0-bd32-3d9f1255d4bf',
            name: 'Authoritites',
            icon: 'security',
            url: 'authorities',
            sortOrder: 3,
            children: [],
          },
        ],
      },
      {
        id: 'aa280394-1bd2-4f3f-8380-5d06cf7cee46',
        name: 'Organisation Units',
        icon: 'table_chart',
        url: 'organisation-units',
        sortOrder: 2,
        children: [],
      },
      {
        id: '8716bd51-5d38-4c32-a3ad-9647ad30e889',
        name: 'Reports',
        icon: 'description',
        url: 'manage-reports',
        sortOrder: 2,
        children: [],
      },
      {
        id: 'd7f5ef22-a53c-4335-94d9-c024a5afd69e',
        name: 'Flow Management',
        icon: 'account_tree',
        url: '',
        sortOrder: 8,
        children: [
          {
            id: '58e5cfca-36dc-40be-aa1b-0ae60c47ab23',
            name: 'Programs',
            icon: 'group_work',
            url: 'programs',
            sortOrder: 11,
            children: [],
          },
          {
            id: '0d77feb4-7706-437b-8b7b-e53e7d37cc35',
            name: 'Data Elements',
            icon: 'insights',
            url: 'data-elements',
            sortOrder: 10,
            children: [],
          },
          {
            id: '3b982e69-dd3a-4b8f-a71a-f3cf4aa4e826',
            name: 'Contacts',
            icon: 'contacts',
            url: 'contacts',
            sortOrder: 9,
            children: [],
          },
          {
            id: 'af7b3a19-acc7-4976-ac3e-787cec195c7d',
            name: 'Flows',
            icon: 'account_tree',
            url: 'flows',
            sortOrder: 7,
            children: [],
          },
        ],
      },
    ];
  }
}

/**  Copyright 2024 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */
