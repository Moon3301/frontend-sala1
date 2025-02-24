import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MessageService } from 'primeng/api';
import { environments } from '../../../../environments/environments';
import { ListsCarrusel, MovieCarrusel } from '../../interfaces/movies.interface';
import { AdministrationService } from '../../services/administration.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'administration-edit-carrusel',
  standalone: false,

  templateUrl: './edit-carrusel.component.html',
  styleUrl: './edit-carrusel.component.css'
})
export class EditCarruselComponent {

  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>

  listMovies: MovieCarrusel[] = [];

  baseUrl = environments.baseUrl;

  listUpdates: MovieCarrusel[] = [];
  existingIds = new Set<number>();
  loading = false;

  constructor(
    private administrationService: AdministrationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCarruselData();
  }

  private loadCarruselData(): void {
      this.loading = true;
      this.administrationService.getMovieCarrusel().subscribe({
        next: (resp: ListsCarrusel) => {
          this.listMovies = resp.filterMovies;
          this.listUpdates = resp.moviesCarrusel.sort((a, b) => a.position - b.position);
          this.updateExistingIds();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar el carrusel'
          });
          this.loading = false;
        }
      });
    }

    private updateExistingIds(): void {
      this.existingIds = new Set(this.listUpdates.map(m => m.externalMovieId));
    }

    onMoveToTarget(event: any): void {

      const newItems = event.items.filter((item: MovieCarrusel) =>
        !this.existingIds.has(item.externalMovieId)
      );

      if (newItems.length === 0) return;

      const requests = newItems.map((item: MovieCarrusel) =>

        this.administrationService.addItemToCarrusel(
          item.externalMovieId.toString(),
          this.listUpdates.length + 1,
          ''
        ).subscribe((resp)=> {
          console.log(resp);
        })

      );

      forkJoin(requests).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Elementos agregados correctamente'
          });
          this.loadCarruselData();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al agregar elementos'
          });
        }
      });
    }

    onMoveToSource(event: any): void {

      const itemsToRemove = event.items as MovieCarrusel[];

      const requests = itemsToRemove.map(item =>
        this.administrationService.removeItemCarrusel(item.externalMovieId)
      );

      forkJoin(requests).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Elementos eliminados correctamente'
          });
          this.loadCarruselData();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar elementos'
          });
        }
      });
    }

    triggerFileInput(product: any) {
      const input = this.fileInputs.find((_, index) =>
        this.listUpdates[index] === product
      )?.nativeElement;

      if (input) {
        input.click();
      }
    }

    async handleFileUpload(event: Event, movie: MovieCarrusel) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];

      if (file) {
        try {
          // 1. Mostrar preview inmediata
          const previewUrl = await this.readFileAsDataURL(file);
          movie.poster_url = previewUrl;

          console.log('movie:', movie);
          console.log('file:', movie.poster_url);

           // Armamos FormData
          const formData = new FormData();
          formData.append('poster', file); // El nombre 'poster' debe coincidir con FileInterceptor('poster')
          formData.append('external_id', movie.externalMovieId.toString());
          formData.append('position', (this.listUpdates.length + 1).toString());

          // Llamamos a la nueva ruta de NestJS
          this.administrationService.uploadMoviePoster(formData).subscribe({
            next: (resp) => {
              console.log(resp);
              // recargamos la data
              this.loadCarruselData();
            },
            error: (err) => {
              console.error('Error:', err);
            },
          });

        } catch (error) {
          console.error('Error uploading image:', error);
          // Manejar errores
        }
      }
    }

    private readFileAsDataURL(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
}
