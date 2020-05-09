import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import fromPairs from 'lodash.frompairs';

enum SUPPORTED_CONTROL_TYPES {
  radio
}
@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  // @Input()
  // controls: [ { type: SUPPORTED_CONTROL_TYPES, options: [], value: any } ];

  constructor(private dialogRef: MatDialogRef<EditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(fromPairs(this.data.controls.map(x => [x.id, x.value])));
  }

  close() {
    this.dialogRef.close();
  }
}
