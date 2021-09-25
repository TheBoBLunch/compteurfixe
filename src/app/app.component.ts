import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CounterService } from './services/counter.service';
import { CounterActionService } from './services/counteraction.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// L'interface AfterViewInit me permettra de modifie le fond d'écran
export class AppComponent implements AfterViewInit  {
  title = 'projet-compteur';

  //Ici j'utilise des service car facile d'accès dans toute l'application, ils comportent comme des variables globales
  counterService; // Le compteur de l'application
  counterActionService; // Le compteur de click total (que ce soit dans la page up ou down), il determinera l'évolution du facteur X
  
  xFactor=1; // Le facteur X d'incrémentation ou de décrémentation du compteur

  //Je passe elementRef et router en paramètre, aux chargement de la page c'est le navigateur qui les renseignera
  //Ca m'évitera de les instancier moi-même et de me tromper
  //ElementRef me permettra d'agir sur le fond d'écran, Router me permettra de savoir dans quelle page je suis
  constructor(private elementRef: ElementRef, private router : Router) 
  {
  this.counterService=new CounterService;
  this.counterActionService=new CounterActionService;
  }

  ngOnInit() {  
  
  if(!(localStorage.getItem('ge') === null))
  {
      console.log(window.localStorage.getItem('ge'));
      this.counterService=JSON.parse(window.localStorage.getItem("ge")||"{}");
  }
  }  

  //Retourne la valeur du compteur
  public getCount() {
    return this.counterService.count;
  }

  //C'est la fonction qui s'execute lorsqu'on appuie sur le bouton push
  //Selon la page ou se trouve il appelle une fonction d'incrémentation si la page et up, ou de décrémentation du compteur si la page est down
  public proceed(){
    if (this.router.url ==="/up")
    {
      this.incCount();
    }
    else
    {
      this.decCount();
    }
  
    //on persiste automatiquement la valeur du compteur pour ne pas la perdre au rafraichissement de la page
    window.localStorage.setItem("ge", JSON.stringify(this.counterService));
  }

  //Vérifie si onest sur la page reset
  public isReset(){
    return (this.router.url ==="/reset");
  }

  //fonction d'incrémentation du compteur
  //Si le compteur atteint 10, on change la couleur de fond via ngAfterViewUnit
  //le compteur d'action, de click total augmente systématiquement
  public incCount(){
    this.counterService.count += this.xFactor;
    if (this.counterService.count>=10)
    {this.ngAfterViewInit();}
    this.incCountAction();
  }

  //fonction de décrémentation du compteur
  //Si le compteur atteint -10, on change la couleur de fond via ngAfterViewUnit
  //le compteur d'action, de click total augmente systématiquement
  public decCount(){
    this.counterService.count -= this.xFactor;
    if (this.counterService.count<=-10)
    {this.ngAfterViewInit();}
    this.incCountAction();
  }

  //Remet le compteur à zéro
  public resetCount(){
    this.counterService.count = 0;
  }

  //Retourne le nombre de click sur le site
  public getCountAction() {
    return this.counterActionService.count
  }

  //Augmente le compteur du nombre de click sur le site
  //Au bout de 30 actions X devient X*2
  //Au bout de 60 actions X devient X*4
  public incCountAction(){
    this.counterActionService.count += 1;
    if (this.counterActionService.count === 30)
    { this.xFactor=this.xFactor*2;}
    if (this.counterActionService.count === 60)
    { this.xFactor=this.xFactor*4;}
  }

  //Change le fond d'écran en rouge ou vert selon que compteur atteigne 10 ou -10
  ngAfterViewInit() {
  if (this.counterService.count>=10) 
  {        this.elementRef.nativeElement.ownerDocument
              .body.style.backgroundColor = "#e74c3c";}
  if (this.counterService.count<=-10) 
  {        this.elementRef.nativeElement.ownerDocument
              .body.style.backgroundColor = "#27ae60";}

  }

  //Retourne l'url de la page courante
  public getUrl() {
    return this.router.url;
  }

  //On traite les valeurs du formulaire, ici il n'y a que la date de naissance entrée par l'utilisateur
  public onSubmit(form: NgForm) {
        this.calculAge(form.value.dateN); //La date de entrée dateN est un string
  }

  //Calcule l'age en fonction d'une date de naissance
  public calculAge(dateNais: string)
  {
      var ageSaisi = dateNais.split('-');

      var datejour = new Date();
      var age = new Date();

      age.setFullYear(parseInt(ageSaisi[0]));
      age.setMonth(parseInt(ageSaisi[1])-1);
      age.setDate(parseInt(ageSaisi[2]));

      //une année c'est 60*60*24*365.25*1000 millisecondes
      //Car 60 secondes dans 1 minute, 60 minutes dans 1 heure
      //24 heures dans 1 journée, 365.25 jours par an (en moyenne)
      //Car 1 année sur 4 compte 366 jours, on parle d'années bisextiles
      var annee=60*60*24*365.25*1000;

      //un mois c'est 60*60*24*30*1000 millisecondes
      //Car 60 secondes dans 1 minute, 60 minutes dans 1 heure
      //24 heures dans 1 journée, 30.4 jours par mois (en moyenne)
      var mois=60*60*24*30.42*1000;

      //différences de millisecondes entre ma date de naissance et aujourd'hui
      var diff=datejour.getTime()-age.getTime();

      //On obtient le nombre d'années arrondi à l'unité inférieure
      var an=Math.floor(diff/annee);
      console.log(an);

      //Si l'utilisateur a strictement plus de 18 ans
      if(an>18){
        this.resetCount();
        //on persiste automatiquement la valeur du compteur pour ne pas la perdre au rafraichissement de la page
        window.localStorage.setItem("ge", JSON.stringify(this.counterService));
      }
  }
}