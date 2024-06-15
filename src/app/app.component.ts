import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'dob',
    'gender',
    'education',
    'company',
    'experience',
    'package',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

   newdata : any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _empService: EmployeeService,
    private _coreService: CoreService,
   
  ) {}

  ngOnInit(): void {
    this.getEmployeeList();
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(EmpAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }


  getEmployeeList() {
    fetch('https://atsbackend-j54j.onrender.com/applicant')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
      this.dataSource=this.dataSource = new MatTableDataSource(data);;
      this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
       
    });



    
  }
       
     
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
//   getEmployeeList() {
//     this._empService.getEmployeeList().subscribe({
//       next: (res) => {
//         fetch('http://localhost:5001/applicant')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
         
//            this.dataSource=data;
//            this.dataSource.sort = this.sort;
//            this.dataSource.paginator = this.paginator;
//         })
//         .catch(error => {
//             console.error('There was a problem with the fetch operation:', error);
           
//         });
     

    
       
//       },
//       error: console.log,
//     });
//   }

//   applyFilter(event: Event) {
    
//     const filterValue = (event.target as HTMLInputElement).value;
//   //  console.log(filterValue);
//     this.dataSource.filter = filterValue.trim().toLowerCase();
// // console.log(this.dataSource)
    
//     if (this.dataSource.paginator) {
//       console.log(this.dataSource.paginator)
//       this.dataSource.paginator.firstPage();
//     }
//   }

  async deleteEmployee(id: number) {
  
   

  const res= await fetch(`https://atsbackend-j54j.onrender.com/applicant/${id}`, {
        method: 'DELETE'
    });
        if (!res.ok) {
          console.log("error came")
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        this._coreService.openSnackBar('Employee deleted!', 'done');
        this.getEmployeeList();
        const data= await res.json();
  
    console.log(data);   
  }

  openEditForm(data: any) {
    console.log(data);

    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }
}
