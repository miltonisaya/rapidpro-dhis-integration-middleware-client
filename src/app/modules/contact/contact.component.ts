import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableDataSource
} from "@angular/material/table";
import {ContactService} from "./contact.service";
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FlexModule} from '@angular/flex-layout';
import {CommonModule} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Contact} from "./types/Contact";
import {NotifierService} from "../notification/notifier.service";
import {ContactApiResponse} from "./types/ContactApiResponse";
import {DialogComponent} from "../../components/dialog-component";
import {MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {ReactiveFormsModule} from "@angular/forms";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {ConfirmDialogComponent} from "../../components/confirm/confirm.dialog";

@Component({
    selector: 'app-roles',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css'],
    standalone: true,
    imports: [
        FlexModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatTable,
        MatColumnDef,
        MatHeaderCellDef,
        MatHeaderCell,
        MatCellDef,
        MatCell,
        MatIconButton,
        MatTooltip,
        MatIcon,
        MatHeaderRowDef,
        MatHeaderRow,
        MatRowDef,
        MatRow,
        MatPaginator,
        CommonModule,
        MatProgressSpinner,
        MatSort,
        MatSortHeader,
        MatButton,
        DialogComponent,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCheckbox,
        MatGridList,
        MatGridTile,
        ReactiveFormsModule,
        CdkTextareaAutosize,
        ConfirmDialogComponent
    ],
    providers: [
        ContactService
    ], schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ContactComponent implements OnInit {
    title: string = 'Contacts';
    data: Contact[] = [];

    //Create/Update Dialog Config
    createEditDialogOpen: boolean = false;

    //Pagination starts here
    @ViewChild('paginator', {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource = new MatTableDataSource<Contact>([]);
    displayedColumns: string[] = ['number', 'name', 'facilityName', 'facilityCode', 'age', 'urn', 'sex', 'actions'];
    pageSize = 10;
    pageIndex = 0;
    params: { pageNo: number; pageSize: number; sortBy: string };
    pageNo: number = 0;
    totalRecords = 0;
    pageSizeOptions: number[] = [10, 25, 100, 1000];
    @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
    constructor(
        public contactService: ContactService,
        public notifierService: NotifierService
    ) {
    }

    ngOnInit() {
        this.getContacts();
    }

    pageChanged(e: any) {
        this.pageSize = e.pageSize;
        this.pageNo = e.pageIndex;
        this.getContacts();
    }

    getContacts() {
        this.params = {
            "pageNo": this.pageNo,
            "pageSize": this.pageSize,
            "sortBy": "name"
        }

        return this.contactService.get(this.params).subscribe((response: ContactApiResponse) => {
            this.dataSource.data = response.data || [];
            this.totalRecords = response.total ? response.total : 0;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }, error => {
            this.notifierService.showNotification(error.error.message, 'OK', 'error');
        });
    }

    openEditDialog(row: any): void {
        this.createEditDialogOpen = true;
        const contactData: Contact = {
            uuid: row.uuid,
            registrationDate: row.registrationDate,
            createdOn: row.createdOn,
            facilityCode: row.code,
            urn: row.urn,
            name: row.name,
            organisationUnit: row.organisationUnit,
            sex: row.sex,
            fields: row.fields
        };
        this.contactService.populateForm(contactData);
    }

    submitCreateEditContactForm() {
        if (this.contactService.form.valid) {
            if (this.contactService.form.get('uuid')?.value != '') {
                this.contactService.update(this.contactService.form.value)
                    .subscribe((response: { message: string; }) => {
                        this.notifierService.showNotification(response.message, 'OK', 'success');
                        this.createEditDialogOpen = false;
                        this.getContacts();
                    }, (error: { message: string; }) => {
                        this.notifierService.showNotification(error.message, 'OK', 'error');
                        this.createEditDialogOpen = false;
                        this.getContacts();
                    });
            } else {
                this.contactService.create(this.contactService.form.value)
                    .subscribe((response: { message: string; }) => {
                        this.notifierService.showNotification(response.message, 'OK', 'error');
                        this.createEditDialogOpen = false;
                        this.getContacts();
                    }, (error: { message: string; }) => {
                        this.notifierService.showNotification(error.message, 'OK', 'error');
                        this.createEditDialogOpen = false;
                        this.getContacts();
                    });
            }
        }
    }

    handleClose($event: boolean) {
    }
}


