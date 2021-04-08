import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, tipo: 'hospitales'|'medicos'|'usuarios'): string {
    if(!img){
      return `${base_url}/upload/${tipo}/no-image`;
    }else if(img.includes('https')){
      return img;
    }else if(img){
      return `${base_url}/upload/${tipo}/${img}`;
    }else{
      return `${base_url}/upload/${tipo}/no-image`;
    }
  }

}
