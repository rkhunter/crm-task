import { Injectable } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../components/edit-dialog/edit-dialog.component';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
    constructor(private dialog: MatDialog) {}

    showEditDialog(opts: { controls: any[], title?: string, confirmationButtonLabel?: string, cancelButtonLabel?: string}) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            ...opts
        }

        return this.dialog.open(EditDialogComponent, dialogConfig).afterClosed().pipe(
            map((x) => x)
        );
    }
}