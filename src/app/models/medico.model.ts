import { Hospital } from "./hospital.mode";

interface _MedicoUser{
    _id: string,
    nombre: string,
    img: string
}

export class Medico{
    constructor(
        public nombre,
        public img?: string,
        public id?: string,
        public usuario?: _MedicoUser,
        public hospital?: Hospital
    ){}
}