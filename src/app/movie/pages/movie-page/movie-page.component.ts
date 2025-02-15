import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../interfaces/movie.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ICines } from '../../interfaces/funciones.interface';
import { MatDialog } from '@angular/material/dialog';
import { ExpansionPanelComponent } from '../../components/expansion-panel/expansion-panel.component';
import { CardVideoComponent } from '../../components/card-video/card-video.component';

@Component({
  selector: 'movie-movie-page',
  standalone: false,

  templateUrl: './movie-page.component.html',
  styleUrl: './movie-page.component.css'
})
export class MoviePageComponent  implements OnInit{

  movie?: Movie
  trailerSafeUrl!: SafeResourceUrl;
  funciones?: ICines[]

  constructor(
    private activateRoute: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
  ){}

  ngOnInit(): void {

    console.log('Entrando a movie');

    this.activateRoute.params
      .pipe(
        switchMap( ({ id }) =>{

          const movieId = +id
          return this.movieService.getMovieByIdLocal( movieId )
        }),
      ).subscribe( movie => {

        if( !movie ) return this.router.navigateByUrl('/')

        this.movie = movie

        return;
      })

    const embedUrl = this.getYouTubeEmbedUrl(this.movie?.trailer_url)

    this.trailerSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl!);

    if(this.movie){

      navigator.geolocation.getCurrentPosition(
        (position)=> {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          console.log(`Latitude: ${lat}, Longitude: ${lng}`);

          const regionName = localStorage.getItem("user_ubication")

          this.movieService.getCinemasByUbicationAndMovie(this.movie?.id!, regionName!).subscribe(
            (cinemas) => {
              this.funciones = cinemas
              console.log(this.funciones);

            }
          )

        }
      )

    }

  }

  // Extrae el ID de un URL de YouTube y genera un embed URL
  getYouTubeEmbedUrl(originalUrl: string | undefined): string {
  if (!originalUrl) return '';

  let videoId = '';

  // 1. Si incluye "youtu.be/" => corta a partir de esa ruta
  if (originalUrl.includes('youtu.be/')) {
    // https://youtu.be/VIDEO_ID
    const parts = originalUrl.split('youtu.be/');
    videoId = parts[1]?.split('?')[0]; // en caso haya parámetros
  }
  // 2. Si incluye "watch?v=" => parsea el valor del v=...
  else if (originalUrl.includes('watch?v=')) {
    const params = new URL(originalUrl).searchParams;
    videoId = params.get('v') || '';
  }
  // 3. Si ya incluye "embed/" (caso raro) => extrae todo lo que esté después de /embed/
  else if (originalUrl.includes('/embed/')) {
    const parts = originalUrl.split('/embed/');
    videoId = parts[1]?.split('?')[0];
  }

  // 4. Si por alguna razón videoId sigue vacío, puedes dejarlo tal cual
  // o manejar un fallback. Pero asumiendo que sí sacaste el ID correctamente:
  if (!videoId) {
    return ''; // O un fallback
  }

  // 5. Retorna el link de embed final
  return `https://www.youtube.com/embed/${videoId}`;
  }

  getYouTubeThumbnailUrl(originalUrl: string | undefined): string {
    if (!originalUrl) return '';

    let videoId = '';

    // 1. Si incluye "youtu.be/"
    if (originalUrl.includes('youtu.be/')) {
      const parts = originalUrl.split('youtu.be/');
      videoId = parts[1]?.split('?')[0]; // en caso tenga parámetros
    }
    // 2. Si incluye "watch?v="
    else if (originalUrl.includes('watch?v=')) {
      const params = new URL(originalUrl).searchParams;
      videoId = params.get('v') || '';
    }
    // 3. Si incluye "embed/"
    else if (originalUrl.includes('/embed/')) {
      const parts = originalUrl.split('/embed/');
      videoId = parts[1]?.split('?')[0];
    }

    if (!videoId) return ''; // o algún valor por defecto

    // Retorna la URL del thumbnail, en este caso "hqdefault" es de alta calidad
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }


  openBillboards(){
    this.dialog.open(ExpansionPanelComponent, {
      data: {
        billboards: this.funciones,
        movie: this.movie
      },
      width: '80%',
      height: '80%',
      maxWidth: '100%',
      panelClass: 'custom-dialog-container',    // Clase personalizada para el contenedor
      backdropClass: 'custom-dialog-backdrop'     // (Opcional) Clase para el backdrop
    });
  }

  openVideoDialog(): void {
    this.dialog.open(CardVideoComponent, {
      data: {
        embedUrl: this.getYouTubeEmbedUrl(this.movie?.trailer_url)
      },
      width: '90%',
      maxWidth: '100%',
      height: '90%'
    });
  }
}
