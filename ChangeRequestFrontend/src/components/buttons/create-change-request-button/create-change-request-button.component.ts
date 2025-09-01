import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CreateChangeRequestDialogComponent } from '../../create-change-request-dialog/create-change-request-dialog.component';

@Component({
  selector: 'app-createchangrequestbutton',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './create-change-request-button.component.html',
  styleUrl: './create-change-request-button.component.css'
})
export class CreatechangrequestbuttonComponent {
  private dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(CreateChangeRequestDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New request created:', result);
      }
    });
  }
}
