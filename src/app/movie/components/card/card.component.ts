import { Component, Input, OnInit } from '@angular/core';
import { Movie } from '../../interfaces/movie.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'movie-card',
  standalone: false,

  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  @Input()
  movie?: Movie

  notImageFound = 'img/not-image.webp';

  constructor(private router:Router){

  }
  ngOnInit(): void {
    if (!this.movie) throw Error('Hero property is required');
  }

  navigateToMovie(movieId: any){
    console.log('Navegando a movie');

    this.router.navigate(['/movie', movieId])
  }

}
