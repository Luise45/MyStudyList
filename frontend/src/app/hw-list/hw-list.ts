import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HwService } from '../services/hw.service';
import { Hw } from '../models/hw.model';
import { CommonModule } from '@angular/common';
declare const bootstrap: any;


@Component({
  selector: 'app-hw-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hw-list.html',
  styleUrls: ['./hw-list.css']
})
export class HwList implements OnInit {
  hws: Hw[] = [];
  filteredHws: Hw[] = [];

  constructor(private hwService: HwService, private router: Router) {}

  ngOnInit(): void {
    this.getHws();
  }

  sortDirection: 'asc' | 'desc' = 'asc';

  toggleSort() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortHws();
  }
  
  sortHws() {
    this.filteredHws = [...this.filteredHws].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
  
      return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }
  


  getHws() {
    this.hwService.getHws().subscribe({
      next: (data: Hw[]) => {
        this.hws = data;
        this.filteredHws = data;
      },
      error: (err) => {
        console.error('Error fetching hw:', err);
      }
    });
  }

  deleteHw(id: string) {  // Renamed from deleteUser to deleteHw and typed id as string
    if (confirm('Are you sure you are done 👀?')) {
      this.hwService.deleteHw(id).subscribe({
        next: () => {
          this.getHws(); 
          this.showDeleteToast();
        },
        error: (err) => {
          console.error('Error deleting hw:', err);
        }
      });
    }
  }

  showDeleteToast() {
    const toastElement = document.getElementById('deleteToast');
    if (toastElement) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }

  filterHw(input: string) {
    const search = input.toLowerCase();
    this.filteredHws = this.hws.filter(hw => {
      const dateStr = hw.date ? new Date(hw.date).toLocaleDateString() : '';
      return (
        hw.subject.toLowerCase().includes(search) ||
        dateStr.includes(search)
      );
    });
  }

  preventSubmit(event: Event) {
    event.preventDefault();
  }

  goHome() {
    this.router.navigate(['/']);
  }

 



}